import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { OrderStatusHistoryRepository } from "../../../domain/repositories/order-status-history.repository.js";
import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository.js";
import { VoucherRepository } from "../../../domain/repositories/voucher.repository.js";
import { AuditLogRepository } from "../../../domain/repositories/audit-log.repository.js";
import { Order } from "../../../domain/entities/order.entity.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../../../shared/exceptions/app.error.js";

export interface CancelMyOrderInput {
  orderId: string;
  userId: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class CancelMyOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly statusHistoryRepository: OrderStatusHistoryRepository,
    private readonly voucherUsageRepository: VoucherUsageRepository,
    private readonly voucherRepository: VoucherRepository,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async execute(input: CancelMyOrderInput): Promise<Order> {
    const order = await this.orderRepository.findById(input.orderId);
    if (!order) throw new NotFoundError("Order", input.orderId);

    if (order.userId !== input.userId) {
      throw new ForbiddenError("This order does not belong to you");
    }

    if (!["pending", "paid"].includes(order.status)) {
      throw new ValidationError(
        `Order cannot be cancelled at status "${order.status}"`,
      );
    }

    const updated = await this.orderRepository.updateStatus(
      input.orderId,
      "cancelled",
    );

    try {
      const usage = await this.voucherUsageRepository.findUsedByOrderId(
        input.orderId,
      );
      if (usage) {
        await this.voucherUsageRepository.markReturned(usage.id);
        const voucher = await this.voucherRepository.findById(usage.voucherId);
        if (voucher && voucher.usageCount > 0) {
          await this.voucherRepository.update(voucher.id, {
            usageCount: voucher.usageCount - 1,
          });
        }
      }
    } catch (err) {
      console.error("Failed to return voucher:", err);
    }

    try {
      await this.statusHistoryRepository.create({
        orderId: input.orderId,
        status: "cancelled",
        note: input.reason ?? "Cancelled by user",
        changedBy: input.userId,
      });
    } catch (err) {
      console.error("Failed to write status history:", err);
    }

    try {
      await this.auditLogRepository.create({
        userId: input.userId,
        action: "CANCEL_ORDER",
        resource: "Order",
        resourceId: input.orderId,
        details: {
          orderNumber: order.orderNumber,
          reason: input.reason,
        },
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });
    } catch (err) {
      console.error("Failed to write audit log:", err);
    }

    return updated;
  }
}
