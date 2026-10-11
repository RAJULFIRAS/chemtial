export interface ProductImage {
  id: string;
  image: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductUnit {
  id: string;
  unit: string;
  price: number;
  discountedPrice: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
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
  images: ProductImage[];
  units: ProductUnit[];
  rating: number;
  reviews: number;
  inStock: boolean;
  unit: string;
  isPromo: boolean;
  promoDiscount: number | null;
  casNumber: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "manager" | "admin" | "courier" | "user";
}

export interface Category {
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
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string | null;
  code: string | null;
  type: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  isActiveNow: boolean;
}

export interface Banner {
  id: string;
  file: string;
  mediaType: "image" | "video";
  position: string;
  sortOrder: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isPromo?: boolean;
}
