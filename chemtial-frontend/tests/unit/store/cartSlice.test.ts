import { describe, it, expect, vi, beforeEach } from "vitest";
import cartReducer, {
  clearCart,
  setSelectedVoucher,
  clearSelectedVoucher,
  clearError,
  clearVoucherError,
  addToCart,
  updateQuantity,
  removeFromCart,
  fetchCart,
  validateVoucher,
} from "../../../src/store/slices/cartSlice";

vi.mock("../../../src/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const makeCartPayload = () => ({
  items: [
    {
      id: "ci-1",
      productId: "p-1",
      product: { id: "p-1", name: "Test", price: 100 },
      unitName: null,
      quantity: 2,
      price: 100,
    },
  ],
  totalQuantity: 2,
  totalAmount: 200,
});

const makeVoucherPreview = () => ({
  usageId: "usage-1",
  voucherId: "v-1",
  code: "CHEM10",
  title: "10% off",
  category: "discount",
  type: "percentage",
  discount: 10,
  freeShipping: false,
  message: "ok",
});

describe("cartSlice", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns initial state", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    expect(state.items).toEqual([]);
    expect(state.totalQuantity).toBe(0);
    expect(state.selectedVoucherUsageId).toBeNull();
  });

  it("clearCart resets everything", () => {
    const state = cartReducer(
      {
        items: [
          {
            id: "x",
            productId: "p",
            product: { id: "p" } as any,
            unitId: null,
            unitName: null,
            quantity: 1,
            price: 10,
          },
        ],
        totalQuantity: 1,
        totalAmount: 10,
        selectedVoucherUsageId: "v1",
        voucherPreview: null,
        isLoading: false,
        isVoucherLoading: false,
        error: null,
        voucherError: null,
      },
      clearCart(),
    );
    expect(state.items).toEqual([]);
    expect(state.selectedVoucherUsageId).toBeNull();
  });

  it("clearError resets error only", () => {
    const state = cartReducer(
      {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        selectedVoucherUsageId: null,
        voucherPreview: null,
        isLoading: false,
        isVoucherLoading: false,
        error: "err",
        voucherError: "verr",
      },
      clearError(),
    );
    expect(state.error).toBeNull();
    expect(state.voucherError).toBe("verr");
  });

  it("clearVoucherError resets voucher error only", () => {
    const state = cartReducer(
      {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        selectedVoucherUsageId: null,
        voucherPreview: null,
        isLoading: false,
        isVoucherLoading: false,
        error: "err",
        voucherError: "verr",
      },
      clearVoucherError(),
    );
    expect(state.voucherError).toBeNull();
    expect(state.error).toBe("err");
  });

  it("setSelectedVoucher stores preview", () => {
    const state = cartReducer(
      undefined,
      setSelectedVoucher({
        usageId: "u-1",
        preview: makeVoucherPreview(),
      }),
    );
    expect(state.selectedVoucherUsageId).toBe("u-1");
    expect(state.voucherPreview?.code).toBe("CHEM10");
    expect(state.voucherError).toBeNull();
  });

  it("clearSelectedVoucher resets", () => {
    const state = cartReducer(
      {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        selectedVoucherUsageId: "u-1",
        voucherPreview: null,
        isLoading: false,
        isVoucherLoading: false,
        error: null,
        voucherError: null,
      },
      clearSelectedVoucher(),
    );
    expect(state.selectedVoucherUsageId).toBeNull();
    expect(state.voucherPreview).toBeNull();
  });

  it("fetchCart pending sets isLoading", () => {
    const state = cartReducer(undefined, { type: fetchCart.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it("fetchCart fulfilled replaces items", () => {
    const state = cartReducer(undefined, {
      type: fetchCart.fulfilled.type,
      payload: makeCartPayload(),
    });
    expect(state.items).toHaveLength(1);
    expect(state.totalAmount).toBe(200);
    expect(state.isLoading).toBe(false);
  });

  it("fetchCart rejected sets error", () => {
    const state = cartReducer(undefined, {
      type: fetchCart.rejected.type,
      error: { message: "Failed" },
    });
    expect(state.error).toBe("Failed");
  });

  it("addToCart fulfilled replaces items", () => {
    const state = cartReducer(undefined, {
      type: addToCart.fulfilled.type,
      payload: makeCartPayload(),
    });
    expect(state.items).toHaveLength(1);
    expect(state.totalQuantity).toBe(2);
  });

  it("updateQuantity fulfilled replaces items", () => {
    const state = cartReducer(undefined, {
      type: updateQuantity.fulfilled.type,
      payload: makeCartPayload(),
    });
    expect(state.totalAmount).toBe(200);
  });

  it("removeFromCart removes and updates totals", () => {
    const initial = {
      items: [
        {
          id: "ci-1",
          productId: "p",
          product: {} as any,
          unitId: null,
          unitName: null,
          quantity: 2,
          price: 50,
        },
        {
          id: "ci-2",
          productId: "p2",
          product: {} as any,
          unitId: null,
          unitName: null,
          quantity: 1,
          price: 30,
        },
      ],
      totalQuantity: 3,
      totalAmount: 130,
      selectedVoucherUsageId: "u-1",
      voucherPreview: null,
      isLoading: false,
      isVoucherLoading: false,
      error: null,
      voucherError: null,
    };
    const state = cartReducer(initial, {
      type: removeFromCart.fulfilled.type,
      payload: "ci-1",
    });
    expect(state.items).toHaveLength(1);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(30);
  });

  it("removeFromCart clears voucher when cart empty", () => {
    const initial = {
      items: [
        {
          id: "ci-1",
          productId: "p",
          product: {} as any,
          unitId: null,
          unitName: null,
          quantity: 1,
          price: 50,
        },
      ],
      totalQuantity: 1,
      totalAmount: 50,
      selectedVoucherUsageId: "u-1",
      voucherPreview: makeVoucherPreview(),
      isLoading: false,
      isVoucherLoading: false,
      error: null,
      voucherError: null,
    };
    const state = cartReducer(initial, {
      type: removeFromCart.fulfilled.type,
      payload: "ci-1",
    });
    expect(state.selectedVoucherUsageId).toBeNull();
    expect(state.voucherPreview).toBeNull();
  });

  it("validateVoucher pending sets loading", () => {
    const state = cartReducer(undefined, {
      type: validateVoucher.pending.type,
    });
    expect(state.isVoucherLoading).toBe(true);
    expect(state.voucherError).toBeNull();
  });

  it("validateVoucher fulfilled stores preview", () => {
    const state = cartReducer(undefined, {
      type: validateVoucher.fulfilled.type,
      payload: makeVoucherPreview(),
    });
    expect(state.selectedVoucherUsageId).toBe("usage-1");
    expect(state.voucherPreview?.discount).toBe(10);
  });

  it("validateVoucher rejected stores error", () => {
    const state = cartReducer(undefined, {
      type: validateVoucher.rejected.type,
      payload: "Voucher invalid",
    });
    expect(state.voucherError).toBe("Voucher invalid");
    expect(state.selectedVoucherUsageId).toBeNull();
    expect(state.voucherPreview).toBeNull();
  });
});
