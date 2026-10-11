import { z } from "zod";

export const createProductReviewSchema = z.object({
  orderItemId: z.string().min(1, "Order item ID is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateProductReviewDTO = z.infer<typeof createProductReviewSchema>;

export interface ProductReviewResponse {
  id: string;
  productId: string;
  orderItemId: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

export interface ProductRatingSummary {
  average: number;
  count: number;
}
