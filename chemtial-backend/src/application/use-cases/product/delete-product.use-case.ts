import { ProductRepository } from "../../../domain/repositories/product.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product", id);
    await this.productRepository.delete(id);
  }
}
