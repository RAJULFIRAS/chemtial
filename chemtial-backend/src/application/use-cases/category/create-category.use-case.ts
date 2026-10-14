import { CategoryRepository } from "../../../domain/repositories/category.repository.js";
import { CreateCategoryDTO, CategoryResponse } from "../../dtos/category.dto.js";
import { ConflictError } from "../../../shared/exceptions/app.error.js";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async execute(input: CreateCategoryDTO): Promise<CategoryResponse> {
    const existingName = await this.categoryRepository.findByName(input.name);
    if (existingName) {
      throw new ConflictError("Category with this name already exists");
    }

    const slug = this.generateSlug(input.name);

    const category = await this.categoryRepository.save({
      id: crypto.randomUUID(),
      name: input.name,
      nameEn: input.nameEn ?? null,
      nameZh: input.nameZh ?? null,
      nameHi: input.nameHi ?? null,
      nameRu: input.nameRu ?? null,
      nameAr: input.nameAr ?? null,
      slug,
      sortOrder: input.sortOrder ?? 0,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any);

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
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    };
  }
}
