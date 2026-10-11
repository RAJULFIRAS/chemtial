import { ProductReviewRepository } from "../../../domain/repositories/product-review.repository";
import {
  ProductReviewResponse,
  ProductRatingSummary,
} from "../../dtos/product-review.dto";

export interface ProductReviewsResult {
  reviews: ProductReviewResponse[];
  summary: ProductRatingSummary;
}

export class GetProductReviewsUseCase {
  constructor(
    private readonly productReviewRepository: ProductReviewRepository,
  ) {}

  async execute(productId: string): Promise<ProductReviewsResult> {
    const reviews =
      await this.productReviewRepository.findByProductId(productId);
    const summary =
      await this.productReviewRepository.getAverageRating(productId);

    return {
      reviews: reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        orderItemId: r.orderItemId,
        userId: r.userId,
        userName: r.user?.name ?? null,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
      summary: {
        average: Math.round(summary.average * 10) / 10,
        count: summary.count,
      },
    };
  }
}
