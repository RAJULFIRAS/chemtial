import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateOrderStatusUseCase } from "../../../../src/application/use-cases/order/update-order-status.use-case";
import {
  NotFoundError,
  ValidationError,
} from "../../../../src/shared/exceptions/app.error";

const makeOrder = (overrides: any = {}) => ({
  id: "o-1",
  userId: "u-1",
  status: "pending",
  orderNumber: "ORD-1",
  totalAmount: 100,
  paymentMethod: "bank_transfer",
  ...overrides,
});

describe("UpdateOrderStatusUseCase", () => {
  let orderRepo: any;
  let auditRepo: any;
  let historyRepo: any;
  let voucherUsageRepo: any;
  let voucherRepo: any;
  let useCase: UpdateOrderStatusUseCase;

  beforeEach(() => {
    orderRepo = {
      findById: vi.fn(),
      updateStatus: vi
        .fn()
        .mockImplementation((id, status) =>
          Promise.resolve(makeOrder({ id, status })),
        ),
    };
    auditRepo = { create: vi.fn().mockResolvedValue(undefined) };
    historyRepo = { create: vi.fn().mockResolvedValue(undefined) };
    voucherUsageRepo = { findUsedByOrderId: vi.fn().mockResolvedValue(null) };
    voucherRepo = { findById: vi.fn(), update: vi.fn() };
    useCase = new UpdateOrderStatusUseCase(
      orderRepo,
      auditRepo,
      historyRepo,
      voucherUsageRepo,
      voucherRepo,
    );
  });

  it("throws when order not found", async () => {
    orderRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute("o-1", "paid")).rejects.toThrow(NotFoundError);
  });

  it("throws on invalid status", async () => {
    orderRepo.findById.mockResolvedValue(makeOrder());
    await expect(useCase.execute("o-1", "foobar")).rejects.toThrow(
      ValidationError,
    );
  });

  it("throws on cancelled order", async () => {
    orderRepo.findById.mockResolvedValue(makeOrder({ status: "cancelled" }));
    await expect(useCase.execute("o-1", "paid")).rejects.toThrow("cancelled");
  });

  it("throws on delivered order", async () => {
    orderRepo.findById.mockResolvedValue(makeOrder({ status: "delivered" }));
    await expect(useCase.execute("o-1", "paid")).rejects.toThrow("completed");
  });

  it("throws on invalid transition (pending → shipped)", async () => {
    orderRepo.findById.mockResolvedValue(makeOrder({ status: "pending" }));
    await expect(useCase.execute("o-1", "shipped")).rejects.toThrow(
      "Cannot transition",
    );
  });

  it("allows pending → paid (non-COD)", async () => {
    orderRepo.findById.mockResolvedValue(
      makeOrder({ status: "pending", paymentMethod: "bank_transfer" }),
    );
    const res = await useCase.execute("o-1", "paid");
    expect(res.status).toBe("paid");
  });

  it("allows COD pending → processing", async () => {
    orderRepo.findById.mockResolvedValue(
      makeOrder({ status: "pending", paymentMethod: "cod" }),
    );
    const res = await useCase.execute("o-1", "processing");
    expect(res.status).toBe("processing");
  });

  it("allows COD shipped → delivered", async () => {
    orderRepo.findById.mockResolvedValue(
      makeOrder({ status: "shipped", paymentMethod: "cod" }),
    );
    const res = await useCase.execute("o-1", "delivered");
    expect(res.status).toBe("delivered");
  });
});
