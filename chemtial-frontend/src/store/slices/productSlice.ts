import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";
import { apiClient } from "../../services/api";

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedBrand: string | null;
  isLoading: boolean;
  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
  }) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
);

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  searchQuery: "",
  selectedCategory: null,
  selectedBrand: null,
  isLoading: false,
  error: null,
  meta: { page: 1, limit: 10, total: 0 },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string | null>) => {
      state.selectedBrand = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = null;
      state.selectedBrand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.filteredProducts = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Gagal memuat produk";
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedBrand,
  clearFilters,
} = productSlice.actions;
export default productSlice.reducer;
