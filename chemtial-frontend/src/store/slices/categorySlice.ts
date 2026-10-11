import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../services/api";

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

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const CACHE_TTL = 5 * 60 * 1000;

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params: { search?: string; isActive?: boolean } = {}) => {
    const response = await apiClient.get("/categories", { params });
    return response.data.data as Category[];
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { category: CategoryState };
      if (
        state.category.lastFetched &&
        Date.now() - state.category.lastFetched < CACHE_TTL &&
        state.category.categories.length > 0
      ) {
        return false;
      }
      return true;
    },
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    invalidateCategoryCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Gagal memuat kategori";
      });
  },
});

export const { clearCategoryError, invalidateCategoryCache } =
  categorySlice.actions;
export default categorySlice.reducer;
