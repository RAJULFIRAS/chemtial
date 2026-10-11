import { Product } from "../entities/product.entity";

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(params: {
    page: number;
    limit: number;
    category?: string;
    brand?: string;
    search?: string;
    isPromo?: boolean;
    recent?: boolean;
  }): Promise<{ data: Product[]; total: number }>;
  save(product: Product): Promise<Product>;
  update(
    id: string,
    data: Partial<{
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
      image: string;
      unit: string;
      isPromo: boolean;
      promoDiscount: number | null;
      casNumber: string | null;
    }>,
  ): Promise<Product>;
  delete(id: string): Promise<void>;
  replaceImages(productId: string, imagePaths: string[]): Promise<void>;
  replaceUnits(
    productId: string,
    units: { unit: string; price: number; stock: number }[],
  ): Promise<void>;
}
