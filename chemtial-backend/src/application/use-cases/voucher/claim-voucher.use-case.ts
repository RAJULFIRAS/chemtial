import { VoucherRepository } from "../../../domain/repositories/voucher.repository";
import { VoucherUsageRepository } from "../../../domain/repositories/voucher-usage.repository";
import { OrderRepository } from "../../../domain/repositories/order.repository";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "../../../shared/exceptions/app.error";

export interface ClaimVoucherResponse {
  usageId: string;
  voucherId: string;
  code: string;
  title: string;
  category: string;
  type: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: Date;
  endDate: Date;
  claimedAt: Date;
}

export class ClaimVoucherUseCase {
  constructor(
    private readonly voucherRepository: VoucherRepository,
    private readonly voucherUsageRepository: VoucherUsageRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    voucherId: string,
    userId: string,
  ): Promise<ClaimVoucherResponse> {
    const voucher = await this.voucherRepository.findById(voucherId);
    if (!voucher) throw new NotFoundError("Voucher", voucherId);

    const now = new Date();

    if (new Date(voucher.startDate) > now) {
      throw new ValidationError("Voucher is not yet valid");
    }

    if (new Date(voucher.endDate) < now) {
      throw new ValidationError("Voucher has expired");
    }

    const existing = await this.voucherUsageRepository.findByUserAndVoucher(
      userId,
      voucherId,
    );
    if (existing) {
      throw new ConflictError("You have already claimed this voucher");
    }

    if (voucher.category === "new_user") {
      const userOrders = await this.orderRepository.findByUserId(userId);
      const hasCompletedOrder = userOrders.some(
        (o) => o.status === "delivered",
      );
      if (hasCompletedOrder) {
        throw new ValidationError(
          "This voucher is only for new users who have not completed any order",
        );
      }
    }

    const usage = await this.voucherUsageRepository.claim(voucherId, userId);

    const v = usage.voucher!;
    return {
      usageId: usage.id,
      voucherId: v.id,
      code: v.code,
      title: v.title,
      category: v.category,
      type: v.type,
      value: v.value,
      minPurchase: v.minPurchase,
      maxDiscount: v.maxDiscount,
      startDate: v.startDate,
      endDate: v.endDate,
      claimedAt: usage.claimedAt,
    };
  }
}
