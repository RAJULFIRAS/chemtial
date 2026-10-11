import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "../../services/api";
import { Product } from "../../types";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  unitId: string | null;
  unitName: string | null;
  quantity: number;
  price: number;
}

export interface VoucherPreview {
  usageId: string;
  voucherId: string;
  code: string;
  title: string;
  category: string;
  type: string;
  discount: number;
  freeShipping: boolean;
  message: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  selectedVoucherUsageId: string | null;
  voucherPreview: VoucherPreview | null;
  isLoading: boolean;
  isVoucherLoading: boolean;
  error: string | null;
  voucherError: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  selectedVoucherUsageId: null,
  voucherPreview: null,
  isLoading: false,
  isVoucherLoading: false,
  error: null,
  voucherError: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await apiClient.get("/cart");
  return response.data.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    productId,
    unitId,
    quantity,
  }: {
    productId: string;
    unitId?: string;
    quantity: number;
  }) => {
    const response = await apiClient.post("/cart/items", {
      productId,
      unitId,
      quantity,
    });
    return response.data.data;
  },
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({
    cartItemId,
    quantity,
  }: {
    cartItemId: string;
    quantity: number;
  }) => {
    const response = await apiClient.patch(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return response.data.data;
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: string) => {
    await apiClient.delete(`/cart/items/${cartItemId}`);
    return cartItemId;
  },
);

export const validateVoucher = createAsyncThunk(
  "cart/validateVoucher",
  async (
    payload: { voucherUsageId: string; orderAmount: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post("/vouchers/validate", {
        voucherUsageId: payload.voucherUsageId,
        orderAmount: payload.orderAmount,
      });
      return response.data.data as VoucherPreview;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Voucher tidak valid");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVoucherError: (state) => {
      state.voucherError = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.selectedVoucherUsageId = null;
      state.voucherPreview = null;
      state.voucherError = null;
    },
    setSelectedVoucher: (
      state,
      action: PayloadAction<{ usageId: string; preview: VoucherPreview }>,
    ) => {
      state.selectedVoucherUsageId = action.payload.usageId;
      state.voucherPreview = action.payload.preview;
      state.voucherError = null;
    },
    clearSelectedVoucher: (state) => {
      state.selectedVoucherUsageId = null;
      state.voucherPreview = null;
      state.voucherError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Gagal memuat cart";
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })

      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.totalAmount = action.payload.totalAmount;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalQuantity = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        if (state.items.length === 0) {
          state.selectedVoucherUsageId = null;
          state.voucherPreview = null;
        }
      })

      .addCase(validateVoucher.pending, (state) => {
        state.isVoucherLoading = true;
        state.voucherError = null;
      })
      .addCase(validateVoucher.fulfilled, (state, action) => {
        state.isVoucherLoading = false;
        state.voucherPreview = action.payload;
        state.selectedVoucherUsageId = action.payload.usageId;
        state.voucherError = null;
      })
      .addCase(validateVoucher.rejected, (state, action) => {
        state.isVoucherLoading = false;
        state.voucherError =
          (action.payload as string) || "Voucher tidak valid";
        state.selectedVoucherUsageId = null;
        state.voucherPreview = null;
      });
  },
});

export const {
  clearError,
  clearVoucherError,
  clearCart,
  setSelectedVoucher,
  clearSelectedVoucher,
} = cartSlice.actions;

export default cartSlice.reducer;
