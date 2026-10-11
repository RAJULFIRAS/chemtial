import { BannerRepository } from "../../../domain/repositories/banner.repository";
import { UpdateBannerDTO, BannerResponse } from "../../dtos/banner.dto";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class UpdateBannerUseCase {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async execute(id: string, input: UpdateBannerDTO): Promise<BannerResponse> {
    const existing = await this.bannerRepository.findById(id);
    if (!existing) throw new NotFoundError("Banner", id);

    const updateData: any = { ...input };
    if (input.startDate) updateData.startDate = new Date(input.startDate);
    if (input.endDate) updateData.endDate = new Date(input.endDate);

    const updated = await this.bannerRepository.update(id, updateData);

    const b = updated as any;
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
