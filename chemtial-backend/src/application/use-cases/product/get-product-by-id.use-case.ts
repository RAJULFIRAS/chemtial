import { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { ProductResponse } from "../../dtos/product.dto.js";
import { ProductMapper } from "../../mappers/product.mapper.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product", id);
    }
    return ProductMapper.toResponse(product);
  }
}
