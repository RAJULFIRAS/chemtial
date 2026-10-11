import { VoucherRepository } from "../../../domain/repositories/voucher.repository";
import { VoucherResponse } from "../../dtos/voucher.dto";

export class GetVouchersUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async execute(params: {
    isActive?: boolean;
    search?: string;
    onlyActiveNow?: boolean;
    category?: string;
  }): Promise<VoucherResponse[]> {
    const vouchers = params.onlyActiveNow
      ? await this.voucherRepository.findActive(params.category)
      : await this.voucherRepository.findAll(params);

    const now = new Date();
    return vouchers.map((v: any) => ({
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
      usageLimit: v.usageLimit,
      usageCount: v.usageCount,
      perUserLimit: v.perUserLimit,
      isActive: v.isActive,
      isActiveNow: v.isActive && v.startDate <= now && v.endDate >= now,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));
  }
}
