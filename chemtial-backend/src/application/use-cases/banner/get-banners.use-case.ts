import { BannerRepository } from "../../../domain/repositories/banner.repository.js";
import { BannerResponse } from "../../dtos/banner.dto.js";

export class GetBannersUseCase {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async execute(params: {
    position?: string;
    onlyActiveNow?: boolean;
  }): Promise<BannerResponse[]> {
    const banners = params.onlyActiveNow
      ? await this.bannerRepository.findActive(params.position)
      : await this.bannerRepository.findAll(params);

    return banners.map((b: any) => ({
      id: b.id,
      file: b.file,
      mediaType: b.mediaType,
      position: b.position,
      sortOrder: b.sortOrder,
      startDate: b.startDate,
      endDate: b.endDate,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));
  }
}
