import { VoucherRepository } from "../../../domain/repositories/voucher.repository";
import { CreateVoucherDTO, VoucherResponse } from "../../dtos/voucher.dto";
import {
  ConflictError,
  ValidationError,
} from "../../../shared/exceptions/app.error";

export class CreateVoucherUseCase {
  constructor(private readonly voucherRepository: VoucherRepository) {}

  async execute(input: CreateVoucherDTO): Promise<VoucherResponse> {
    const existing = await this.voucherRepository.findByCode(input.code);
    if (existing)
      throw new ConflictError("Voucher with this code already exists");

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (endDate <= startDate) {
      throw new ValidationError("End date must be after start date");
    }

    const voucher = await this.voucherRepository.save({
      id: crypto.randomUUID(),
      code: input.code,
      title: input.title,
      description: input.description ?? null,
      type: input.type,
      category: input.category ?? "discount",
      value: input.value,
      minPurchase: input.minPurchase ?? null,
      maxDiscount: input.maxDiscount ?? null,
      startDate,
      endDate,
      usageCount: 0,
      perUserLimit: input.perUserLimit ?? 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

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
