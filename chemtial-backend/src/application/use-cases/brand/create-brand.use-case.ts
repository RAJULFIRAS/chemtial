import { BrandRepository } from "../../../domain/repositories/brand.repository.js";
import { CreateBrandDTO, BrandResponse } from "../../dtos/brand.dto.js";
import { ConflictError } from "../../../shared/exceptions/app.error.js";

export class CreateBrandUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async execute(input: CreateBrandDTO): Promise<BrandResponse> {
    const existingName = await this.brandRepository.findByName(input.name);
    if (existingName)
      throw new ConflictError("Brand with this name already exists");

    const slug = this.generateSlug(input.name);

    const brand = await this.brandRepository.save({
      id: crypto.randomUUID(),
      name: input.name,
      slug,
      logo: input.logo ?? null,
      sortOrder: input.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any);

    const b = brand as any;
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
