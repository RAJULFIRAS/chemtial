import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2).max(100),
  logo: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandDTO = z.infer<typeof createBrandSchema>;
export type UpdateBrandDTO = z.infer<typeof updateBrandSchema>;

export interface BrandResponse {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  sortOrder: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
