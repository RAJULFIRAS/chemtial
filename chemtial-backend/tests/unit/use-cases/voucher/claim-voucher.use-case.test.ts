import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClaimVoucherUseCase } from "../../../../src/application/use-cases/voucher/claim-voucher.use-case";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../../../../src/shared/exceptions/app.error";

const makeVoucher = (overrides: any = {}) => ({
  id: "v-1",
  code: "X",
  title: "T",
  category: "discount",
  type: "percentage",
  value: 10,
  minPurchase: null,
  maxDiscount: null,
  startDate: new Date(Date.now() - 86400000),
  endDate: new Date(Date.now() + 86400000),
  isActive: true,
  ...overrides,
});

describe("ClaimVoucherUseCase", () => {
  let voucherRepo: any;
  let usageRepo: any;
  let orderRepo: any;
  let useCase: ClaimVoucherUseCase;

  beforeEach(() => {
    voucherRepo = { findById: vi.fn() };
    usageRepo = {
      findByUserAndVoucher: vi.fn().mockResolvedValue(null),
      claim: vi.fn().mockImplementation((vid, uid) =>
        Promise.resolve({
          id: "usage-1",
          voucherId: vid,
          userId: uid,
          status: "claimed",
          claimedAt: new Date(),
          voucher: makeVoucher(),
        }),
      ),
    };
    orderRepo = { findByUserId: vi.fn().mockResolvedValue([]) };
    useCase = new ClaimVoucherUseCase(voucherRepo, usageRepo, orderRepo);
  });

  it("throws when voucher not found", async () => {
    voucherRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute("v-1", "u-1")).rejects.toThrow(NotFoundError);
  });

  it("throws when not yet valid", async () => {
    voucherRepo.findById.mockResolvedValue(
      makeVoucher({ startDate: new Date(Date.now() + 86400000) }),
    );
    await expect(useCase.execute("v-1", "u-1")).rejects.toThrow(
      "not yet valid",
    );
  });

  it("throws when expired", async () => {
    voucherRepo.findById.mockResolvedValue(
      makeVoucher({ endDate: new Date(Date.now() - 86400000) }),
    );
    await expect(useCase.execute("v-1", "u-1")).rejects.toThrow("expired");
  });

  it("throws when already claimed", async () => {
    voucherRepo.findById.mockResolvedValue(makeVoucher());
    usageRepo.findByUserAndVoucher.mockResolvedValue({ id: "u-1" });
    await expect(useCase.execute("v-1", "u-1")).rejects.toThrow(ConflictError);
  });

  it("rejects new_user voucher for user with delivered order", async () => {
    voucherRepo.findById.mockResolvedValue(
      makeVoucher({ category: "new_user" }),
    );
    orderRepo.findByUserId.mockResolvedValue([{ status: "delivered" }]);
    await expect(useCase.execute("v-1", "u-1")).rejects.toThrow(
      ValidationError,
    );
  });

  it("claims successfully", async () => {
    voucherRepo.findById.mockResolvedValue(makeVoucher());
    const res = await useCase.execute("v-1", "u-1");
    expect(res.usageId).toBe("usage-1");
  });
});
