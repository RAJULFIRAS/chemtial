import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { CategoryResponse } from "../../dtos/category.dto";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class GetCategoryBySlugUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(slug: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError("Category", slug);

    const cat = category as any;
    return {
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
    };
  }
}
