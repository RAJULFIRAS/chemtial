import { BannerRepository } from "../../../domain/repositories/banner.repository.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class DeleteBannerUseCase {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.bannerRepository.findById(id);
    if (!existing) throw new NotFoundError("Banner", id);
    await this.bannerRepository.delete(id);
  }
}
