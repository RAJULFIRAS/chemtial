import { PromoRepository } from "../../../domain/repositories/promo.repository.js";
import { PromoResponse } from "../../dtos/promo.dto.js";

export class GetPromosUseCase {
  constructor(private readonly promoRepository: PromoRepository) {}

  async execute(params: {
    isActive?: boolean;
    search?: string;
    onlyActiveNow?: boolean;
  }): Promise<PromoResponse[]> {
    const promos = params.onlyActiveNow
      ? await this.promoRepository.findActive()
      : await this.promoRepository.findAll(params);

    const now = new Date();
    return promos.map((p: any) => ({
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
    }));
  }
}
