import { BannerRepository } from "../../../domain/repositories/banner.repository.js";
import { BannerResponse } from "../../dtos/banner.dto.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetBannerByIdUseCase {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async execute(id: string): Promise<BannerResponse> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) throw new NotFoundError("Banner", id);

    const b = banner as any;
    return {
      id: b.id,
      file: b.file,
      mediaType: b.mediaType,
      position: b.position,
      sortOrder: b.sortOrder,
      startDate: b.startDate,
      endDate: b.endDate,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }
}
