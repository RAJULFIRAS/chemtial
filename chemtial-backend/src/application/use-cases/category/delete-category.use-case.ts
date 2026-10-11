import { CategoryRepository } from "../../../domain/repositories/category.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category", id);
    }

    await this.categoryRepository.delete(id);
  }
}
