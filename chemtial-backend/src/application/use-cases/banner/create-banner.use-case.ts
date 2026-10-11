import { BannerRepository } from "../../../domain/repositories/banner.repository";
import { CreateBannerDTO, BannerResponse } from "../../dtos/banner.dto";

export class CreateBannerUseCase {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async execute(input: CreateBannerDTO): Promise<BannerResponse> {
    const banner = await this.bannerRepository.save({
      id: crypto.randomUUID(),
      file: input.file,
      mediaType: input.mediaType ?? "image",
      position: input.position ?? "hero",
      sortOrder: input.sortOrder ?? 0,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

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
