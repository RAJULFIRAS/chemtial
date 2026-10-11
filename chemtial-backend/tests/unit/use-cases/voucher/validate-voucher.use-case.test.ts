import { describe, it, expect, vi, beforeEach } from "vitest";
import { ValidateVoucherUseCase } from "../../../../src/application/use-cases/voucher/validate-voucher.use-case";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "../../../../src/shared/exceptions/app.error";

const makeUsage = (overrides: any = {}) => ({
  id: "usage-1",
  userId: "user-1",
  status: "claimed",
  voucher: {
    id: "v-1",
    code: "CHEM10",
    title: "10% off",
    type: "percentage",
    category: "discount",
    value: 10,
    minPurchase: null,
    maxDiscount: null,
    startDate: new Date(Date.now() - 86400000),
    endDate: new Date(Date.now() + 86400000),
    isActive: true,
  },
  ...overrides,
});

describe("ValidateVoucherUseCase", () => {
  let usageRepo: any;
  let orderRepo: any;
  let useCase: ValidateVoucherUseCase;

  beforeEach(() => {
    usageRepo = { findById: vi.fn() };
    orderRepo = { findByUserId: vi.fn().mockResolvedValue([]) };
    useCase = new ValidateVoucherUseCase(usageRepo, orderRepo);
  });

  it("should throw when usage not found", async () => {
    usageRepo.findById.mockResolvedValue(null);
    await expect(
      useCase.execute({
        voucherUsageId: "u",
        userId: "user-1",
        orderAmount: 100,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw when usage belongs to other user", async () => {
    usageRepo.findById.mockResolvedValue(makeUsage({ userId: "other" }));
    await expect(
      useCase.execute({
        voucherUsageId: "u",
        userId: "user-1",
        orderAmount: 100,
      }),
    ).rejects.toThrow(ForbiddenError);
  });

  it("should throw when voucher already used", async () => {
    usageRepo.findById.mockResolvedValue(makeUsage({ status: "used" }));
    await expect(
      useCase.execute({
        voucherUsageId: "u",
        userId: "user-1",
        orderAmount: 100,
      }),
    ).rejects.toThrow("already been used");
  });

  it("should throw when voucher expired", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: {
          ...makeUsage().voucher,
          endDate: new Date(Date.now() - 1000),
        },
      }),
    );
    await expect(
      useCase.execute({
        voucherUsageId: "u",
        userId: "user-1",
        orderAmount: 100,
      }),
    ).rejects.toThrow("expired");
  });

  it("should reject when below min purchase", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: { ...makeUsage().voucher, minPurchase: 200 },
      }),
    );
    await expect(
      useCase.execute({
        voucherUsageId: "u",
        userId: "user-1",
        orderAmount: 100,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it("should calculate percentage discount", async () => {
    usageRepo.findById.mockResolvedValue(makeUsage());
    const res = await useCase.execute({
      voucherUsageId: "u",
      userId: "user-1",
      orderAmount: 200,
    });
    expect(res.discount).toBe(20);
  });

  it("should cap discount at maxDiscount", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: { ...makeUsage().voucher, maxDiscount: 15 },
      }),
    );
    const res = await useCase.execute({
      voucherUsageId: "u",
      userId: "user-1",
      orderAmount: 200,
    });
    expect(res.discount).toBe(15);
  });

  it("should handle fixed discount", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: {
          ...makeUsage().voucher,
          type: "fixed",
          value: 25,
        },
      }),
    );
    const res = await useCase.execute({
      voucherUsageId: "u",
      userId: "user-1",
      orderAmount: 100,
    });
    expect(res.discount).toBe(25);
  });

  it("should handle free shipping", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: { ...makeUsage().voucher, type: "free_shipping" },
      }),
    );
    const res = await useCase.execute({
      voucherUsageId: "u",
      userId: "user-1",
      orderAmount: 100,
    });
    expect(res.freeShipping).toBe(true);
    expect(res.discount).toBe(0);
  });

  it("should cap discount at order amount", async () => {
    usageRepo.findById.mockResolvedValue(
      makeUsage({
        voucher: {
          ...makeUsage().voucher,
          type: "fixed",
          value: 500,
        },
      }),
    );
    const res = await useCase.execute({
      voucherUsageId: "u",
      userId: "user-1",
      orderAmount: 100,
    });
    expect(res.discount).toBe(100);
  });
});
