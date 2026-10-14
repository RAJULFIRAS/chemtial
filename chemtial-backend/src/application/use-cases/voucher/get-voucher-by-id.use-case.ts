import { VoucherRepository } from "../../../domain/repositories/voucher.repository.js";
import { VoucherResponse } from "../../dtos/voucher.dto.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetVoucherByIdUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async execute(id: string): Promise<VoucherResponse> {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) throw new NotFoundError("Voucher", id);

    const v = voucher as any;
    const now = new Date();
    return {
      id: v.id,
      code: v.code,
      title: v.title,
      description: v.description,
      type: v.type,
      category: v.category,
      value: v.value,
      minPurchase: v.minPurchase,
      maxDiscount: v.maxDiscount,
      startDate: v.startDate,
      endDate: v.endDate,
      usageCount: v.usageCount,
      perUserLimit: v.perUserLimit,
      isActiveNow: v.startDate <= now && v.endDate >= now,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    };
  }
}
