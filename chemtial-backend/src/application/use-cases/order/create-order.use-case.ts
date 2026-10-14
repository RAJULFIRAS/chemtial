import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { OrderStatusHistoryRepository } from "../../../domain/repositories/order-status-history.repository.js";
import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository.js";
import { VoucherRepository } from "../../../domain/repositories/voucher.repository.js";
import { ValidateVoucherUseCase } from "../voucher/validate-voucher.use-case.js";
import { CreateOrderDTO } from "../../dtos/order.dto.js";
import { Order } from "../../../domain/entities/order.entity.js";
import { ValidationError } from "../../../shared/exceptions/app.error.js";
import { config } from "../../../config/env.validation.js";

const roundMoney = (n: number): number => Math.round(n * 100) / 100;

export interface CreateOrderInput extends CreateOrderDTO {
  voucherUsageId?: string;
}

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly statusHistoryRepository: OrderStatusHistoryRepository,
    private readonly voucherUsageRepository: VoucherUsageRepository,
    private readonly voucherRepository: VoucherRepository,
    private readonly validateVoucherUseCase: ValidateVoucherUseCase,
  ) {}

  async execute(userId: string, data: CreateOrderInput): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new ValidationError("Cart is empty");
    }

    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new ValidationError(`Product ${item.productId} not found`);
      }
      if (!product.inStock) {
        throw new ValidationError(`Product ${product.name} is out of stock`);
      }
    }

    let subtotal = 0;
    let productDiscount = 0;

    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) continue;

      let unitPrice = product.price;
      if (item.unitName) {
        const matchedUnit = product.units.find((u) => u.unit === item.unitName);
        if (matchedUnit) unitPrice = matchedUnit.price;
      }

      const finalUnitPrice =
        product.isPromo && product.promoDiscount
          ? roundMoney(unitPrice * (1 - product.promoDiscount / 100))
          : unitPrice;

      subtotal += roundMoney(finalUnitPrice * item.quantity);

      if (product.isPromo && product.promoDiscount) {
        const discountPerItem = roundMoney(unitPrice - finalUnitPrice);
        productDiscount += roundMoney(discountPerItem * item.quantity);
      }
    }

    subtotal = roundMoney(subtotal);
    productDiscount = roundMoney(productDiscount);
    const afterProductDiscount = roundMoney(subtotal - productDiscount);

    let voucherDiscount = 0;
    let freeShipping = false;
    let voucherUsageId: string | null = null;
    let voucherIdToIncrement: string | null = null;

    if (data.voucherUsageId) {
      const validation = await this.validateVoucherUseCase.execute({
        voucherUsageId: data.voucherUsageId,
        userId,
        orderAmount: afterProductDiscount,
      });

      voucherDiscount = validation.discount;
      freeShipping = validation.freeShipping;
      voucherUsageId = validation.usageId;
      voucherIdToIncrement = validation.voucherId;
    }

    const baseShippingCost = config.DEFAULT_SHIPPING_COST;
    const shippingCost = freeShipping ? 0 : baseShippingCost;

    const totalAmount = roundMoney(
      Math.max(0, afterProductDiscount - voucherDiscount + shippingCost),
    );

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await this.orderRepository.create(
      userId,
      {
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
      },
      orderNumber,
    );

    let finalOrder = order;
    if (data.paymentMethod === "cod") {
      finalOrder = await this.orderRepository.updateStatus(
        order.id,
        "processing",
      );
    }

    await this.updateOrderTotals(order.id, {
      subtotal,
      productDiscount,
      voucherDiscount,
      shippingCost,
      totalAmount,
    });

    if (voucherUsageId && voucherIdToIncrement) {
      try {
        await this.voucherUsageRepository.markUsed(
          voucherUsageId,
          order.id,
          voucherDiscount,
        );
        await this.voucherRepository.incrementUsage(voucherIdToIncrement);
      } catch (err) {
        console.error("Failed to mark voucher as used:", err);
      }
    }

    try {
      await this.statusHistoryRepository.create({
        orderId: order.id,
        status: "pending",
        note: "Order created",
        changedBy: userId,
      });

      if (data.paymentMethod === "cod") {
        await this.statusHistoryRepository.create({
          orderId: order.id,
          status: "processing",
          note: "COD order automatically processed",
          changedBy: userId,
        });
      }
    } catch (historyError) {
      console.error("Failed to write initial status history:", historyError);
    }

    await this.cartRepository.clear(userId);

    const refreshed = await this.orderRepository.findById(finalOrder.id);
    return refreshed ?? finalOrder;
  }

  private async updateOrderTotals(
    orderId: string,
    totals: {
      subtotal: number;
      productDiscount: number;
      voucherDiscount: number;
      shippingCost: number;
      totalAmount: number;
    },
  ): Promise<void> {
    try {
      await this.orderRepository.updateTotals(orderId, totals);
    } catch (err) {
      console.error("Failed to update order totals:", err);
    }
  }
}
