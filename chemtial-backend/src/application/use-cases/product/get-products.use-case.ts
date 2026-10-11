import { ProductRepository } from "../../../domain/repositories/product.repository";
import { ProductQueryDTO, ProductResponse } from "../../dtos/product.dto";
import { ProductMapper } from "../../mappers/product.mapper";

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(
    query: ProductQueryDTO,
  ): Promise<{ data: ProductResponse[]; total: number }> {
    const result = await this.productRepository.findAll({
      page: query.page,
      limit: query.limit,
      category: query.category,
      brand: query.brand,
      search: query.search,
      isPromo: query.isPromo,
      recent: query.recent,
    });

    return {
      data: result.data.map(ProductMapper.toResponse),
      total: result.total,
    };
  }
}
