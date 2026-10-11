import { Product } from "../../../domain/entities/product.entity";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { CreateProductDTO, ProductResponse } from "../../dtos/product.dto";
import { ProductMapper } from "../../mappers/product.mapper";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductDTO): Promise<ProductResponse> {
    const product = new Product(
      crypto.randomUUID(),
      input.name,
      input.nameEn ?? null,
      input.nameZh ?? null,
      input.nameHi ?? null,
      input.nameRu ?? null,
      input.nameAr ?? null,
      input.description ?? null,
      input.descriptionEn ?? null,
      input.descriptionZh ?? null,
      input.descriptionHi ?? null,
      input.descriptionRu ?? null,
      input.descriptionAr ?? null,
      input.brand,
      input.brandId ?? null,
      input.category,
      input.categoryId ?? null,
      input.price,
      input.image,
      input.rating ?? 0,
      input.reviews ?? 0,
      input.unit,
      input.isPromo ?? false,
      input.promoDiscount ?? null,
      input.casNumber ?? null,
      new Date(),
      new Date(),
    );

    const saved = await this.productRepository.save(product);

    if (input.images && input.images.length > 0) {
      await this.productRepository.replaceImages(saved.id, input.images);
    }

    if (input.units && input.units.length > 0) {
      await this.productRepository.replaceUnits(saved.id, input.units);
    }

    const refreshed = await this.productRepository.findById(saved.id);
    return ProductMapper.toResponse(refreshed!);
  }
}
