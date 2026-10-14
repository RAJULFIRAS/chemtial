import { PromoRepository } from "../../../domain/repositories/promo.repository.js";
import { CreatePromoDTO, PromoResponse } from "../../dtos/promo.dto.js";
import {
  ConflictError,
  ValidationError,
} from "../../../shared/exceptions/app.error.js";

export class CreatePromoUseCase {
  constructor(private readonly promoRepository: PromoRepository) {}

  async execute(input: CreatePromoDTO): Promise<PromoResponse> {
    if (input.code) {
      const existing = await this.promoRepository.findByCode(input.code);
      if (existing)
        throw new ConflictError("Promo with this code already exists");
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (endDate <= startDate) {
      throw new ValidationError("End date must be after start date");
    }

    const promo = await this.promoRepository.save({
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? null,
      code: input.code ?? null,
      type: input.type,
      value: input.value,
      minPurchase: input.minPurchase ?? null,
      maxDiscount: input.maxDiscount ?? null,
      image: input.image ?? null,
      bannerUrl: input.bannerUrl ?? null,
      startDate,
      endDate,
      usageLimit: input.usageLimit ?? null,
      usageCount: 0,
      isActive: input.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const p = promo as any;
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
