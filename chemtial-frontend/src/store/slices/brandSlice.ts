import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../services/api";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface BrandState {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: BrandState = {
  brands: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const CACHE_TTL = 5 * 60 * 1000;

export const fetchBrands = createAsyncThunk(
  "brand/fetchBrands",
  async (params: { search?: string; isActive?: boolean } = {}) => {
    const response = await apiClient.get("/brands", { params });
    return response.data.data as Brand[];
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { brand: BrandState };
      if (
        state.brand.lastFetched &&
        Date.now() - state.brand.lastFetched < CACHE_TTL &&
        state.brand.brands.length > 0
      ) {
        return false;
      }
      return true;
    },
  },
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
    invalidateBrandCache: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Gagal memuat brand";
      });
  },
});

export const { clearBrandError, invalidateBrandCache } = brandSlice.actions;
export default brandSlice.reducer;
