import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordUseCase } from "../../../../src/application/use-cases/auth/forgot-password.use-case";

describe("ForgotPasswordUseCase", () => {
  let userRepo: any;
  let useCase: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new ForgotPasswordUseCase(userRepo);
  });

  it("returns empty when user not found (no leak)", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    const res = await useCase.execute({ email: "x@x.com" });
    expect(res.resetToken).toBeUndefined();
  });

  it("returns resetToken in development", async () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const mockUser = {
      email: "x@x.com",
      updateResetToken: vi.fn(),
    };
    userRepo.findByEmail.mockResolvedValue(mockUser);
    const res = await useCase.execute({ email: "x@x.com" });
    expect(res.resetToken).toBeDefined();
    expect(userRepo.save).toHaveBeenCalledOnce();
    process.env.NODE_ENV = oldEnv;
  });

  it("returns empty in production", async () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const mockUser = {
      email: "x@x.com",
      updateResetToken: vi.fn(),
    };
    userRepo.findByEmail.mockResolvedValue(mockUser);
    const res = await useCase.execute({ email: "x@x.com" });
    expect(res.resetToken).toBeUndefined();
    process.env.NODE_ENV = oldEnv;
  });
});
