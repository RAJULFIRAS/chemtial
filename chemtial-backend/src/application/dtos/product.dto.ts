import { z } from "zod";

export const productQuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("20"),
  category: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  isPromo: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  recent: z
    .string()
    .transform((v) => v === "true")
    .optional(),
});

const productUnitSchema = z.object({
  unit: z.string().min(1).max(50),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  nameEn: z.string().min(2).max(200).optional(),
  nameZh: z.string().min(1).max(200).optional(),
  nameHi: z.string().min(1).max(200).optional(),
  nameRu: z.string().min(1).max(200).optional(),
  nameAr: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  descriptionEn: z.string().max(5000).optional(),
  descriptionZh: z.string().max(5000).optional(),
  descriptionHi: z.string().max(5000).optional(),
  descriptionRu: z.string().max(5000).optional(),
  descriptionAr: z.string().max(5000).optional(),
  brand: z.string().min(1).max(100),
  brandId: z.string().optional(),
  category: z.string().min(1).max(200),
  categoryId: z.string().optional(),
  price: z.number().positive(),
  image: z.string().min(1),
  images: z
    .array(z.string().min(1))
    .max(10, "Maksimal 10 gambar per produk")
    .optional(),
  units: z
    .array(productUnitSchema)
    .max(20, "Maksimal 20 varian unit per produk")
    .optional(),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  unit: z.string().min(1).max(50),
  isPromo: z.boolean().default(false),
  promoDiscount: z.number().min(0).max(100).optional(),
  casNumber: z.string().max(50).optional(),
});

export const updateProductSchema = createProductSchema.partial();
export type ProductQueryDTO = z.infer<typeof productQuerySchema>;
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

export interface ProductUnitResponse {
  id: string;
  unit: string;
  price: number;
  discountedPrice: number;
  stock: number;
  isActive: boolean;
}

export interface ProductImageResponse {
  id: string;
  image: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  nameHi: string | null;
  nameRu: string | null;
  nameAr: string | null;
  description: string | null;
  descriptionEn: string | null;
  descriptionZh: string | null;
  descriptionHi: string | null;
  descriptionRu: string | null;
  descriptionAr: string | null;
  brand: string;
  brandId: string | null;
  category: string;
  categoryId: string | null;
  price: number;
  originalPrice: number | null;
  discountedPrice: number;
  image: string;
  images: ProductImageResponse[];
  units: ProductUnitResponse[];
  rating: number;
  reviews: number;
  inStock: boolean;
  unit: string;
  isPromo: boolean;
  promoDiscount: number | null;
  casNumber: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
