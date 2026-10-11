import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  nameEn: z.string().min(2).max(100).optional(),
  nameZh: z.string().min(1).max(100).optional(),
  nameHi: z.string().min(1).max(100).optional(),
  nameRu: z.string().min(1).max(100).optional(),
  nameAr: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;

export interface CategoryResponse {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  nameHi: string | null;
  nameRu: string | null;
  nameAr: string | null;
  slug: string;
  sortOrder: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
