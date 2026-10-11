import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository";
import { OrderRepository } from "../../../domain/repositories/order.repository";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../../../shared/exceptions/app.error";

export interface ValidateVoucherInput {
  voucherUsageId: string;
  userId: string;
  orderAmount: number;
}

export interface VoucherValidationResult {
  valid: boolean;
  usageId: string;
  voucherId: string;
  code: string;
  title: string;
  category: string;
  type: string;
  discount: number;
  freeShipping: boolean;
  message: string;
}

export class ValidateVoucherUseCase {
  constructor(
    private readonly voucherUsageRepository: VoucherUsageRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: ValidateVoucherInput): Promise<VoucherValidationResult> {
    const usage = await this.voucherUsageRepository.findById(
      input.voucherUsageId,
    );

    if (!usage) {
      throw new NotFoundError("Voucher usage", input.voucherUsageId);
    }

    if (usage.userId !== input.userId) {
      throw new ForbiddenError("This voucher does not belong to you");
    }

    if (usage.status === "used") {
      throw new ValidationError("Voucher has already been used");
    }
    if (usage.status !== "claimed") {
      throw new ValidationError("Voucher is not available for use");
    }

    const v = usage.voucher;
    if (!v) {
      throw new ValidationError("Voucher details not found");
    }

    const now = new Date();

    if (!v.isActive) {
      throw new ValidationError("Voucher is not active");
    }
    if (new Date(v.startDate) > now) {
      throw new ValidationError("Voucher is not yet valid");
    }
    if (new Date(v.endDate) < now) {
      throw new ValidationError("Voucher has expired");
    }

    if (v.minPurchase !== null && input.orderAmount < v.minPurchase) {
      throw new ValidationError(
        `Minimum purchase is ${v.minPurchase.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}`,
      );
    }

    if (v.category === "new_user") {
      const orders = await this.orderRepository.findByUserId(input.userId);
      const hasCompletedOrder = orders.some((o) => o.status === "delivered");
      if (hasCompletedOrder) {
        throw new ValidationError(
          "This voucher is only for new users who have not completed any order",
        );
      }
    }

    let discount = 0;
    let freeShipping = false;

    if (v.type === "percentage") {
      discount = (input.orderAmount * v.value) / 100;
      if (v.maxDiscount !== null && discount > v.maxDiscount) {
        discount = v.maxDiscount;
      }
    } else if (v.type === "fixed") {
      discount = v.value;
    } else if (v.type === "free_shipping") {
      discount = 0;
      freeShipping = true;
    }

    discount = Math.min(discount, input.orderAmount);
    discount = Math.max(0, Math.round(discount * 100) / 100);

    return {
      valid: true,
      usageId: usage.id,
      voucherId: v.id,
      code: v.code,
      title: v.title,
      category: v.category,
      type: v.type,
      discount,
      freeShipping,
      message: "Voucher is valid",
    };
  }
}
