import { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { UpdateProductDTO, ProductResponse } from "../../dtos/product.dto.js";
import { ProductMapper } from "../../mappers/product.mapper.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<ProductResponse> {
    const existing = await this.productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product", id);

    const { images, units, ...productData } = data;

    await this.productRepository.update(id, productData as any);

    if (images !== undefined) {
      await this.productRepository.replaceImages(id, images);
    }

    if (units !== undefined) {
      await this.productRepository.replaceUnits(id, units);
    }

    const refreshed = await this.productRepository.findById(id);
    return ProductMapper.toResponse(refreshed!);
  }
}
