import { BrandRepository } from "../../../domain/repositories/brand.repository";
import { UpdateBrandDTO, BrandResponse } from "../../dtos/brand.dto";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/exceptions/app.error";

export class UpdateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async execute(id: string, input: UpdateBrandDTO): Promise<BrandResponse> {
    const existing = await this.brandRepository.findById(id);
    if (!existing) throw new NotFoundError("Brand", id);

    if (input.name && input.name !== existing.name) {
      const dup = await this.brandRepository.findByName(input.name);
      if (dup) throw new ConflictError("Brand with this name already exists");
    }

    const updateData: any = { ...input };
    if (input.name) {
      updateData.slug = this.generateSlug(input.name);
    }

    const updated = await this.brandRepository.update(id, updateData);

    const b = updated as any;
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      sortOrder: b.sortOrder,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }
}
