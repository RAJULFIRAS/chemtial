import { PromoRepository } from "../../../domain/repositories/promo.repository.js";
import { UpdatePromoDTO, PromoResponse } from "../../dtos/promo.dto.js";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/exceptions/app.error.js";

export class UpdatePromoUseCase {
  constructor(private readonly promoRepository: PromoRepository) {}

  async execute(id: string, input: UpdatePromoDTO): Promise<PromoResponse> {
    const existing = await this.promoRepository.findById(id);
    if (!existing) throw new NotFoundError("Promo", id);

    if (input.code && input.code !== existing.code) {
      const dup = await this.promoRepository.findByCode(input.code);
      if (dup) throw new ConflictError("Promo with this code already exists");
    }

    const updateData: any = { ...input };
    if (input.startDate) updateData.startDate = new Date(input.startDate);
    if (input.endDate) updateData.endDate = new Date(input.endDate);

    const updated = await this.promoRepository.update(id, updateData);

    const p = updated as any;
    const now = new Date();
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      code: p.code,
      type: p.type,
      value: p.value,
      minPurchase: p.minPurchase,
      maxDiscount: p.maxDiscount,
      image: p.image,
      bannerUrl: p.bannerUrl,
      startDate: p.startDate,
      endDate: p.endDate,
      usageLimit: p.usageLimit,
      usageCount: p.usageCount,
      isActive: p.isActive,
      isActiveNow: p.isActive && p.startDate <= now && p.endDate >= now,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
