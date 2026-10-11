import { OrderRepository } from "../../../domain/repositories/order.repository";

export interface CodOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: Date;
  shippedAt: Date | null;
}

export class GetCodPendingUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<CodOrderSummary[]> {
    const result = await this.orderRepository.findAll({
      page: 1,
      limit: 1000,
    });

    const codOrders = result.data.filter(
      (o) =>
        o.paymentMethod === "cod" &&
        ["shipped", "awaiting_payment"].includes(o.status),
    );

    return codOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: o.totalAmount,
      paymentMethod: o.paymentMethod,
      shippingAddress: o.shippingAddress,
      items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: (item.product as any).name,
        productImage: (item.product as any).image,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      createdAt: o.createdAt,
      shippedAt: (o as any).shippedAt ?? null,
    }));
  }
}
