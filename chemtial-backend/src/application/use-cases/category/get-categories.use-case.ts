import { CategoryRepository } from "../../../domain/repositories/category.repository.js";
import { CategoryResponse } from "../../dtos/category.dto.js";

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(params: { search?: string }): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.findAll(params);

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      nameEn: cat.nameEn,
      nameZh: cat.nameZh,
      nameHi: cat.nameHi,
      nameRu: cat.nameRu,
      nameAr: cat.nameAr,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      productCount: cat._count?.products || 0,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
  }
}
