import { z } from "zod";

export const createPromoSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  code: z.string().max(50).optional(),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().positive(),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  image: z.string().optional(),
  bannerUrl: z.string().optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
});

export const updatePromoSchema = createPromoSchema.partial();

export type CreatePromoDTO = z.infer<typeof createPromoSchema>;
export type UpdatePromoDTO = z.infer<typeof updatePromoSchema>;

export interface PromoResponse {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  type: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  image: string | null;
  bannerUrl: string | null;
  startDate: Date;
  endDate: Date;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  isActiveNow: boolean;
  createdAt: Date;
  updatedAt: Date;
}
