import { BrandRepository } from "../../../domain/repositories/brand.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class DeleteBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.brandRepository.findById(id);
    if (!existing) throw new NotFoundError("Brand", id);
    await this.brandRepository.delete(id);
  }
}
