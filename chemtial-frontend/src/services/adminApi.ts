import { apiClient } from "./api";

export const categoryApi = {
  getAll: async (params?: { isActive?: boolean; search?: string }) => {
    const response = await apiClient.get("/categories", { params });
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/categories", data);
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/categories/${id}`);
  },
};

export const brandApi = {
  getAll: async (params?: { isActive?: boolean; search?: string }) => {
    const response = await apiClient.get("/brands", { params });
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/brands", data);
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/brands/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/brands/${id}`);
  },
};

export const promoApi = {
  getAll: async (params?: {
    isActive?: boolean;
    search?: string;
    activeNow?: boolean;
  }) => {
    const response = await apiClient.get("/promos", { params });
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/promos/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/promos", data);
    return response.data.data;
  },
  getStats: async () => {
    const response = await apiClient.get("/promos/stats");
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/promos/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/promos/${id}`);
  },
};

export const paymentApi = {
  createCheckoutSession: async (data: {
    orderId: string;
    successUrl: string;
    cancelUrl: string;
  }) => {
    const response = await apiClient.post(
      "/payment/create-checkout-session",
      data,
    );
    return response.data.data;
  },
};

export const voucherApi = {
  getAll: async (params?: {
    isActive?: boolean;
    search?: string;
    activeNow?: boolean;
    category?: string;
  }) => {
    const response = await apiClient.get("/vouchers", { params });
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/vouchers/${id}`);
    return response.data.data;
  },
  create: async (data: unknown) => {
    const response = await apiClient.post("/vouchers", data);
    return response.data.data;
  },
  update: async (id: string, data: unknown) => {
    const response = await apiClient.put(`/vouchers/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/vouchers/${id}`);
  },
  validate: async (data: { voucherUsageId: string; orderAmount: number }) => {
    const response = await apiClient.post("/vouchers/validate", data);
    return response.data.data;
  },
  claim: async (voucherId: string) => {
    const response = await apiClient.post(`/vouchers/${voucherId}/claim`);
    return response.data.data;
  },
  getMyVouchers: async (status?: string) => {
    const response = await apiClient.get("/vouchers/my-vouchers", {
      params: { status },
    });
    return response.data.data;
  },
};

export const bannerApi = {
  getAll: async (params?: {
    isActive?: boolean;
    position?: string;
    activeNow?: boolean;
  }) => {
    const response = await apiClient.get("/banners", { params });
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/banners/${id}`);
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("/banners", data);
    return response.data.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/banners/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/banners/${id}`);
  },
};

export interface UploadResult {
  path: string;
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  mediaType?: "image" | "video";
}

const uploadFile = async (
  endpoint: string,
  fieldName: string,
  file: File,
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append(fieldName, file);
  const response = await apiClient.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const uploadApi = {
  uploadProduct: (file: File) => uploadFile("/upload/product", "image", file),
  uploadBrand: (file: File) => uploadFile("/upload/brand", "logo", file),
  uploadCategory: (file: File) => uploadFile("/upload/category", "image", file),
  uploadPromo: (file: File) => uploadFile("/upload/promo", "image", file),
  uploadBanner: (file: File) => uploadFile("/upload/banner", "file", file),
  uploadSingle: (file: File) => uploadFile("/upload/single", "file", file),
};

export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
  }) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get("/orders/admin/stats");
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },
  create: async (data: {
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    review?: string;
    reviewEn?: string;
    brand: string;
    brandId?: string;
    category: string;
    categoryId?: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
    unit: string;
    isPromo?: boolean;
    promoDiscount?: number;
    casNumber?: string;
  }) => {
    const response = await apiClient.post("/products", data);
    return response.data.data;
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const reviewApi = {
  getByProduct: async (productId: string): Promise<ProductReviewsResult> => {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data.data;
  },

  getMyReviews: async (
    orderItemIds: string[],
  ): Promise<ProductReviewResponse[]> => {
    if (orderItemIds.length === 0) return [];
    const response = await apiClient.get("/reviews/my-reviews", {
      params: { orderItemIds: orderItemIds.join(",") },
    });
    return response.data.data;
  },

  create: async (data: {
    orderItemId: string;
    rating: number;
    comment?: string;
  }): Promise<ProductReviewResponse> => {
    const response = await apiClient.post("/reviews", data);
    return response.data.data;
  },
};

export const userApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },
  updateRole: async (id: string, role: string) => {
    const response = await apiClient.patch(`/users/${id}/role`, { role });
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/users/${id}`);
  },
};

export const orderAdminApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await apiClient.get("/orders/admin/all", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string, note?: string) => {
    const response = await apiClient.patch(`/orders/${id}/status`, {
      status,
      note,
    });
    return response.data.data;
  },

  getRevenueReport: async (range: string = "12months") => {
    const response = await apiClient.get("/orders/admin/revenue", {
      params: { range },
    });
    return response.data.data;
  },

  getHistory: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}/history`);
    return response.data.data;
  },

  getCodPending: async () => {
    const response = await apiClient.get("/orders/cod/pending");
    return response.data.data;
  },

  confirmCod: async (orderId: string) => {
    const response = await apiClient.patch(`/orders/cod/${orderId}/confirm`);
    return response.data.data;
  },

  cancelMyOrder: async (orderId: string, reason?: string) => {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data.data;
  },
};

export const downloadApi = {
  track: async (platform: "playstore" | "appstore", referrer?: string) => {
    const response = await apiClient.post("/downloads/track", {
      platform,
      referrer,
    });
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get("/downloads/stats");
    return response.data.data;
  },
  getAnalytics: async (days: number = 30) => {
    const response = await apiClient.get("/downloads/analytics", {
      params: { days },
    });
    return response.data.data;
  },
};

export const authApi = {
  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};

export interface ProductReviewResponse {
  id: string;
  productId: string;
  orderItemId: string;
  userId: string;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ProductRatingSummary {
  average: number;
  count: number;
}

export interface ProductReviewsResult {
  reviews: ProductReviewResponse[];
  summary: ProductRatingSummary;
}
