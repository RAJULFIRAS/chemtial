import { ProductReviewRepository } from "../../../domain/repositories/product-review.repository.js";
import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import {
  CreateProductReviewDTO,
  ProductReviewResponse,
} from "../../dtos/product-review.dto.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  ConflictError,
} from "../../../shared/exceptions/app.error.js";
import { prisma } from "../../../infrastructure/database/prisma/client.js";

export class CreateProductReviewUseCase {
  constructor(
    private readonly productReviewRepository: ProductReviewRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(
    userId: string,
    input: CreateProductReviewDTO,
  ): Promise<ProductReviewResponse> {
    const orders = await this.orderRepository.findByUserId(userId);
    let targetOrder: any = null;
    let targetItem: any = null;

    for (const o of orders) {
      const item = o.items.find((i) => i.id === input.orderItemId);
      if (item) {
        targetOrder = o;
        targetItem = item;
        break;
      }
    }

    if (!targetOrder || !targetItem) {
      throw new NotFoundError("Order item", input.orderItemId);
    }

    if (targetOrder.userId !== userId) {
      throw new ForbiddenError("This order does not belong to you");
    }

    if (targetOrder.status !== "delivered") {
      throw new ValidationError(
        "You can only review after the order has been delivered",
      );
    }

    const existing = await this.productReviewRepository.findByOrderItemId(
      input.orderItemId,
    );
    if (existing) {
      throw new ConflictError("You have already reviewed this item");
    }

    const review = await this.productReviewRepository.create({
      productId: targetItem.productId,
      userId,
      orderId: targetOrder.id,
      orderItemId: input.orderItemId,
      rating: input.rating,
      comment: input.comment ?? null,
    });

    const summary = await this.productReviewRepository.getAverageRating(
      targetItem.productId,
    );

    await prisma.product.update({
      where: { id: targetItem.productId },
      data: {
        rating: Math.round(summary.average * 10) / 10,
        reviews: summary.count,
      },
    });

    return {
      id: review.id,
      productId: review.productId,
      orderItemId: review.orderItemId,
      userId: review.userId,
      userName: review.user?.name ?? null,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }
}
