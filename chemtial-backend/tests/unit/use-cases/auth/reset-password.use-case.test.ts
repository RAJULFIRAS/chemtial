import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResetPasswordUseCase } from "../../../../src/application/use-cases/auth/reset-password.use-case";
import { ValidationError } from "../../../../src/shared/exceptions/app.error";

describe("ResetPasswordUseCase", () => {
  let userRepo: any;
  let passwordService: any;
  let useCase: ResetPasswordUseCase;

  beforeEach(() => {
    userRepo = {
      findByResetToken: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    passwordService = { hash: vi.fn().mockResolvedValue("new-hash") };
    useCase = new ResetPasswordUseCase(userRepo, passwordService);
  });

  it("throws when token not found", async () => {
    userRepo.findByResetToken.mockResolvedValue(null);
    await expect(
      useCase.execute({ token: "x", newPassword: "Pass123!" }),
    ).rejects.toThrow(ValidationError);
  });

  it("throws when token expired", async () => {
    userRepo.findByResetToken.mockResolvedValue({
      resetTokenExp: new Date(Date.now() - 1000),
      updatePassword: vi.fn(),
    });
    await expect(
      useCase.execute({ token: "x", newPassword: "Pass123!" }),
    ).rejects.toThrow("expired");
  });

  it("updates password on success", async () => {
    const user = {
      resetTokenExp: new Date(Date.now() + 86400000),
      updatePassword: vi.fn(),
    };
    userRepo.findByResetToken.mockResolvedValue(user);
    await useCase.execute({ token: "x", newPassword: "Pass123!" });
    expect(user.updatePassword).toHaveBeenCalledWith("new-hash");
    expect(userRepo.save).toHaveBeenCalledOnce();
  });
});
