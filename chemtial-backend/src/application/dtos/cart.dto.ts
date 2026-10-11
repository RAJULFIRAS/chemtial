import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  unitId: z.string().optional(),
  quantity: z.number().int().min(1).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export type AddToCartDTO = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
