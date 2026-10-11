import { BrandRepository } from "../../../domain/repositories/brand.repository";
import { BrandResponse } from "../../dtos/brand.dto";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class GetBrandByIdUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(id: string): Promise<BrandResponse> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) throw new NotFoundError("Brand", id);

    const b = brand as any;
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      sortOrder: b.sortOrder,
      productCount: b._count?.products || 0,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    };
  }
}
