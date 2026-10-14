import { prisma } from "../prisma/client.js";
import {
  Order,
  OrderItem,
  OrderStatus,
} from "../../../domain/entities/order.entity.js";
import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { CreateOrderDTO } from "../../../application/dtos/order.dto.js";
import {
  RevenueReport,
  RevenueRange,
} from "../../../application/use-cases/order/get-revenue-report.use-case.js";

export class PrismaOrderRepository implements OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!order) return null;
    return this.toDomain(order);
  }

  async getRevenueReport(range: RevenueRange): Promise<RevenueReport> {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week": {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;
        startDate.setDate(now.getDate() - diff);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "6months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "12months":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        break;
    }

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { status: true, totalAmount: true, createdAt: true },
    });

    const completedStatuses = [
      "paid",
      "processing",
      "shipped",
      "delivered",
      "awaiting_payment",
    ];
    const validOrders = orders.filter((o) =>
      completedStatuses.includes(o.status),
    );

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = validOrders.length;

    const pendingRevenue = orders
      .filter((o) => o.status === "pending")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const paidRevenue = orders
      .filter((o) => o.status === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const completedRevenue = orders
      .filter((o) =>
        ["delivered", "shipped", "processing", "awaiting_payment"].includes(
          o.status,
        ),
      )
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const monthlyMap: Record<string, { revenue: number; orderCount: number }> =
      {};
    const monthCount =
      range === "12months"
        ? 12
        : range === "6months"
          ? 6
          : range === "3months"
            ? 3
            : 1;

    for (let i = 0; i < monthCount; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (monthCount - 1 - i));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = { revenue: 0, orderCount: 0 };
    }

    for (const order of validOrders) {
      const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap[key]) continue;
      monthlyMap[key].revenue += order.totalAmount;
      monthlyMap[key].orderCount++;
    }

    const monthly = Object.entries(monthlyMap)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orderCount: data.orderCount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const byStatus: Record<string, { count: number; totalAmount: number }> = {};
    for (const order of orders) {
      if (!byStatus[order.status]) {
        byStatus[order.status] = { count: 0, totalAmount: 0 };
      }
      byStatus[order.status].count++;
      byStatus[order.status].totalAmount += order.totalAmount;
    }

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        pendingRevenue,
        paidRevenue,
        completedRevenue,
      },
      monthly,
      byStatus,
      range,
    };
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
      },
    });
    if (!order) return null;
    return this.toDomain(order);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return orders.map((order) => this.toDomain(order));
  }

  async updateTotals(
    id: string,
    totals: {
      subtotal: number;
      productDiscount: number;
      voucherDiscount: number;
      shippingCost: number;
      totalAmount: number;
    },
  ): Promise<void> {
    await prisma.order.update({
      where: { id },
      data: {
        subtotal: totals.subtotal,
        productDiscount: totals.productDiscount,
        voucherDiscount: totals.voucherDiscount,
        shippingCost: totals.shippingCost,
        totalAmount: totals.totalAmount,
        discountAmount:
          Math.round((totals.productDiscount + totals.voucherDiscount) * 100) /
          100,
      },
    });
  }

  async create(
    userId: string,
    data: CreateOrderDTO,
    orderNumber: string,
  ): Promise<Order> {
    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new Error("Cart not found");

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            unitName: item.unitName ?? null,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return this.toDomain(order);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updateData: any = { status };
    if (status === "paid") updateData.paidAt = new Date();
    if (status === "awaiting_payment") updateData.paidAt = new Date();
    if (status === "shipped") updateData.shippedAt = new Date();
    if (status === "delivered") updateData.deliveredAt = new Date();

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: { include: { product: true } },
      },
    });

    return this.toDomain(order);
  }

  async findAll(params: {
    page: number;
    limit: number;
    userId?: string;
    status?: string;
  }): Promise<{ data: Order[]; total: number }> {
    const { page, limit, userId, status } = params;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: data.map((order) => this.toDomain(order)),
      total,
    };
  }

  async findAllAdmin(params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Order[]; total: number }> {
    const { page, limit, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      data: data.map((order) => this.toDomain(order)),
      total,
    };
  }

  private toDomain(data: any): Order {
    const items: OrderItem[] = data.items.map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      unitName: item.unitName ?? null,
    }));

    return {
      id: data.id,
      orderNumber: data.orderNumber,
      userId: data.userId,
      status: data.status as OrderStatus,
      totalAmount: data.totalAmount,
      subtotal: data.subtotal ?? 0,
      productDiscount: data.productDiscount ?? 0,
      voucherDiscount: data.voucherDiscount ?? 0,
      shippingCost: data.shippingCost ?? 0,
      discountAmount: data.discountAmount ?? null,
      voucherCode: data.voucherCode ?? null,
      promoCode: data.promoCode ?? null,
      paymentMethod: data.paymentMethod,
      paymentProof: data.paymentProof ?? null,
      paymentReference: data.paymentReference ?? null,
      paymentNote: data.paymentNote ?? null,
      shippingAddress: data.shippingAddress,
      items,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
