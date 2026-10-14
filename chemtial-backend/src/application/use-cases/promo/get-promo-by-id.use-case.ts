import { PromoRepository } from "../../../domain/repositories/promo.repository.js";
import { PromoResponse } from "../../dtos/promo.dto.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetPromoByIdUseCase {
  constructor(private readonly promoRepository: PromoRepository) {}

  async execute(id: string): Promise<PromoResponse> {
    const promo = await this.promoRepository.findById(id);
    if (!promo) throw new NotFoundError("Promo", id);

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
