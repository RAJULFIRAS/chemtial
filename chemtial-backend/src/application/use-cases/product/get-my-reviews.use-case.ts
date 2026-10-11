import { ProductReviewRepository } from "../../../domain/repositories/product-review.repository";
import { ProductReviewResponse } from "../../dtos/product-review.dto";

export class GetMyReviewsUseCase {
  constructor(
    private readonly productReviewRepository: ProductReviewRepository,
  ) {}

  async execute(
    userId: string,
    orderItemIds: string[],
  ): Promise<ProductReviewResponse[]> {
    const reviews =
      await this.productReviewRepository.findByUserIdAndOrderItemIds(
        userId,
        orderItemIds,
      );

    return reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      orderItemId: r.orderItemId,
      userId: r.userId,
      userName: r.user?.name ?? null,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }
}
