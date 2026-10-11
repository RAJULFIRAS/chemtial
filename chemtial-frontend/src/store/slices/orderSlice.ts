import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../services/api";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  productDiscount: number;
  voucherDiscount: number;
  shippingCost: number;
  discountAmount: number | null;
  voucherCode: string | null;
  promoCode: string | null;
  paymentMethod: string;
  paymentProof: string | null;
  paymentReference: string | null;
  paymentNote: string | null;
  shippingAddress: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    unitName: string | null;
    product: {
      id: string;
      name: string;
      brand: string;
      image: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderHistoryEntry {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}

export interface OrderHistoryResponse {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  history: OrderHistoryEntry[];
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  orderHistory: OrderHistoryResponse | null;
  isLoading: boolean;
  isHistoryLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  orderHistory: null,
  isLoading: false,
  isHistoryLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (
    data: {
      shippingAddress: {
        recipientName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      paymentMethod: string;
      voucherUsageId?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post("/orders", data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Gagal membuat pesanan");
    }
  },
);

export const fetchOrders = createAsyncThunk("order/fetchOrders", async () => {
  const response = await apiClient.get("/orders");
  return response.data.data;
});

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data.data;
  },
);

export const fetchOrderHistory = createAsyncThunk(
  "order/fetchOrderHistory",
  async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}/history`);
    return response.data.data as OrderHistoryResponse;
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.orderHistory = null;
    },
    clearOrderHistory: (state) => {
      state.orderHistory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Gagal membuat pesanan";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isHistoryLoading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state) => {
        state.isHistoryLoading = false;
      });
  },
});

export const { clearOrder, clearOrderHistory } = orderSlice.actions;
export default orderSlice.reducer;
