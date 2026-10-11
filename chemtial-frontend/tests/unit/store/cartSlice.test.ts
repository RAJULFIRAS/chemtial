import { describe, it, expect, vi, beforeEach } from "vitest";
import cartReducer, {
  clearCart,
  setSelectedVoucher,
  clearSelectedVoucher,
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../../../src/store/slices/cartSlice";

vi.mock("../../../src/services/api", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
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

describe("cartSlice", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return initial state", () => {
    const state = cartReducer(undefined, { type: "unknown" });
    expect(state.items).toEqual([]);
    expect(state.totalQuantity).toBe(0);
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

  it("setSelectedVoucher stores preview", () => {
    const state = cartReducer(
      undefined,
      setSelectedVoucher({
        usageId: "u-1",
        preview: {
          usageId: "u-1",
          voucherId: "v-1",
          code: "X",
          title: "T",
          category: "discount",
          type: "percentage",
          discount: 10,
          freeShipping: false,
          message: "ok",
        },
      }),
    );
    expect(state.selectedVoucherUsageId).toBe("u-1");
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
      ],
      totalQuantity: 2,
      totalAmount: 100,
      selectedVoucherUsageId: null,
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
    expect(state.items).toHaveLength(0);
    expect(state.totalQuantity).toBe(0);
  });
});
