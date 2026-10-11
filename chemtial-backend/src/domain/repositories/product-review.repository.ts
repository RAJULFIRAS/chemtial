export interface ProductReviewEntry {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  orderItemId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: { id: string; name: string };
}

export interface ProductReviewRepository {
  findById(id: string): Promise<ProductReviewEntry | null>;
  findByProductId(productId: string): Promise<ProductReviewEntry[]>;
  findByUserId(userId: string): Promise<ProductReviewEntry[]>;
  findByOrderItemId(orderItemId: string): Promise<ProductReviewEntry | null>;
  findByUserIdAndOrderItemIds(
    userId: string,
    orderItemIds: string[],
  ): Promise<ProductReviewEntry[]>;
  create(data: {
    productId: string;
    userId: string;
    orderId: string;
    orderItemId: string;
    rating: number;
    comment?: string | null;
  }): Promise<ProductReviewEntry>;
  getAverageRating(
    productId: string,
  ): Promise<{ average: number; count: number }>;
}
