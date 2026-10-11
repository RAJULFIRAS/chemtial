import { VoucherRepository } from "../../../domain/repositories/voucher.repository";
import { UpdateVoucherDTO, VoucherResponse } from "../../dtos/voucher.dto";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/exceptions/app.error";

export class UpdateVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async execute(id: string, input: UpdateVoucherDTO): Promise<VoucherResponse> {
    const existing = await this.voucherRepository.findById(id);
    if (!existing) throw new NotFoundError("Voucher", id);

    if (input.code && input.code !== existing.code) {
      const dup = await this.voucherRepository.findByCode(input.code);
      if (dup) throw new ConflictError("Voucher with this code already exists");
    }

    const updateData: any = { ...input };
    if (input.startDate) updateData.startDate = new Date(input.startDate);
    if (input.endDate) updateData.endDate = new Date(input.endDate);

    const updated = await this.voucherRepository.update(id, updateData);

    const v = updated as any;
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
