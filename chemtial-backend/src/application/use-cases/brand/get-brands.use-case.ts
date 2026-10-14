import { BrandRepository } from "../../../domain/repositories/brand.repository.js";
import { BrandResponse } from "../../dtos/brand.dto.js";

export class GetBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute(params: { search?: string }): Promise<BrandResponse[]> {
    const brands = await this.brandRepository.findAll(params);

    return brands.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      sortOrder: brand.sortOrder,
      productCount: brand._count?.products || 0,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    }));
  }
}
