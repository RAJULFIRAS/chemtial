import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductResponse } from "../../dtos/product.dto";
import { ProductMapper } from "../../mappers/product.mapper";
import { NotFoundError } from "../../../shared/exceptions/app.error";

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
