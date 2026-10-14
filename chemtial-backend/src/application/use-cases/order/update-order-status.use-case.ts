import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { AuditLogRepository } from "../../../domain/repositories/audit-log.repository.js";
import { OrderStatusHistoryRepository } from "../../../domain/repositories/order-status-history.repository.js";
import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository.js";
import { VoucherRepository } from "../../../domain/repositories/voucher.repository.js";
import { Order } from "../../../domain/entities/order.entity.js";
import {
  NotFoundError,
  ValidationError,
} from "../../../shared/exceptions/app.error.js";

export class UpdateOrderStatusUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly statusHistoryRepository: OrderStatusHistoryRepository,
    private readonly voucherUsageRepository: VoucherUsageRepository,
    private readonly voucherRepository: VoucherRepository,
  ) {}

  async execute(
    orderId: string,
    status: string,
    auditContext?: {
      userId: string;
      ipAddress?: string;
      userAgent?: string;
      note?: string;
    },
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order", orderId);
    }

    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "awaiting_payment",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      throw new ValidationError("Invalid order status");
    }

    if (order.status === "cancelled") {
      throw new ValidationError("Cannot update cancelled order");
    }

    if (order.status === "delivered") {
      throw new ValidationError("Cannot update completed order");
    }

    const isCod = order.paymentMethod === "cod";

    const codTransitions: Record<string, string[]> = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      awaiting_payment: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const nonCodTransitions: Record<string, string[]> = {
      pending: ["paid", "cancelled"],
      paid: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      awaiting_payment: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const validTransitions = isCod ? codTransitions : nonCodTransitions;
    const allowedNext = validTransitions[order.status] || [];

    if (!allowedNext.includes(status)) {
      throw new ValidationError(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      status,
    );

    if (status === "cancelled") {
      try {
        const usage =
          await this.voucherUsageRepository.findUsedByOrderId(orderId);
        if (usage) {
          await this.voucherUsageRepository.markReturned(usage.id);

          const voucher = await this.voucherRepository.findById(
            usage.voucherId,
          );
          if (voucher && voucher.usageCount > 0) {
            await this.voucherRepository.update(voucher.id, {
              usageCount: voucher.usageCount - 1,
            });
          }
        }
      } catch (err) {
        console.error("Failed to return voucher:", err);
      }
    }

    try {
      await this.statusHistoryRepository.create({
        orderId,
        status,
        note: auditContext?.note ?? null,
        changedBy: auditContext?.userId ?? "system",
      });
    } catch (historyError) {
      console.error("Failed to write status history:", historyError);
    }

    try {
      await this.auditLogRepository.create({
        userId: auditContext?.userId || order.userId,
        action: "UPDATE_ORDER_STATUS",
        resource: "Order",
        resourceId: orderId,
        details: {
          previousStatus: order.status,
          newStatus: status,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
        },
        ipAddress: auditContext?.ipAddress,
        userAgent: auditContext?.userAgent,
      });
    } catch (auditError) {
      console.error("Failed to write audit log:", auditError);
    }

    return updatedOrder;
  }
}
