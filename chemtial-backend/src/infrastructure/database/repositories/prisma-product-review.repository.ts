import { prisma } from "../prisma/client";
import {
  ProductReviewEntry,
  ProductReviewRepository,
} from "../../../domain/repositories/product-review.repository";

export class PrismaProductReviewRepository implements ProductReviewRepository {
  async findById(id: string): Promise<ProductReviewEntry | null> {
    const data = await prisma.productReview.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByProductId(productId: string): Promise<ProductReviewEntry[]> {
    const data = await prisma.productReview.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findByUserId(userId: string): Promise<ProductReviewEntry[]> {
    const data = await prisma.productReview.findMany({
      where: { userId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findByUserIdAndOrderItemIds(
    userId: string,
    orderItemIds: string[],
  ): Promise<ProductReviewEntry[]> {
    if (orderItemIds.length === 0) return [];
    const data = await prisma.productReview.findMany({
      where: {
        userId,
        orderItemId: { in: orderItemIds },
      },
      include: { user: { select: { id: true, name: true } } },
    });
    return data.map((d) => this.toDomain(d));
  }

  async findByOrderItemId(
    orderItemId: string,
  ): Promise<ProductReviewEntry | null> {
    const data = await prisma.productReview.findUnique({
      where: { orderItemId },
      include: { user: { select: { id: true, name: true } } },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async create(data: {
    productId: string;
    userId: string;
    orderId: string;
    orderItemId: string;
    rating: number;
    comment?: string | null;
  }): Promise<ProductReviewEntry> {
    const created = await prisma.productReview.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        orderId: data.orderId,
        orderItemId: data.orderItemId,
        rating: data.rating,
        comment: data.comment ?? null,
      },
      include: { user: { select: { id: true, name: true } } },
    });
    return this.toDomain(created);
  }

  async getAverageRating(
    productId: string,
  ): Promise<{ average: number; count: number }> {
    const result = await prisma.productReview.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      average: result._avg.rating ?? 0,
      count: result._count.rating ?? 0,
    };
  }

  private toDomain(data: any): ProductReviewEntry {
    return {
      id: data.id,
      productId: data.productId,
      userId: data.userId,
      orderId: data.orderId,
      orderItemId: data.orderItemId,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      user: data.user ? { id: data.user.id, name: data.user.name } : undefined,
    };
  }
}
