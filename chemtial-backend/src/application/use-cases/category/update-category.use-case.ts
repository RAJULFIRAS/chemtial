import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { UpdateCategoryDTO, CategoryResponse } from "../../dtos/category.dto";
import {
  NotFoundError,
  ConflictError,
} from "../../../shared/exceptions/app.error";

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async execute(
    id: string,
    input: UpdateCategoryDTO,
  ): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) throw new NotFoundError("Category", id);

    if (input.name && input.name !== existing.name) {
      const dup = await this.categoryRepository.findByName(input.name);
      if (dup)
        throw new ConflictError("Category with this name already exists");
    }

    const updateData: any = { ...input };
    if (input.name) {
      updateData.slug = this.generateSlug(input.name);
    }

    const updated = await this.categoryRepository.update(id, updateData);

    const cat = updated as any;
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
