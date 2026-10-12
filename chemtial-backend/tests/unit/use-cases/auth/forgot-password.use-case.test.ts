import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordUseCase } from "../../../../src/application/use-cases/auth/forgot-password.use-case";

vi.mock("../../../../src/infrastructure/email/email.service", () => ({
  emailService: {
    send: vi.fn().mockResolvedValue(undefined),
    sendPasswordReset: vi.fn().mockResolvedValue(undefined),
  },
  EmailService: vi.fn(),
}));

import { emailService } from "../../../../src/infrastructure/email/email.service";

const mockedEmailService = emailService as unknown as {
  sendPasswordReset: ReturnType<typeof vi.fn>;
};

describe("ForgotPasswordUseCase", () => {
  let userRepo: any;
  let useCase: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    useCase = new ForgotPasswordUseCase(userRepo);
    vi.clearAllMocks();
  });

  it("does nothing (no leak) when user not found", async () => {
    userRepo.findByEmail.mockResolvedValue(null);

    await useCase.execute({ email: "x@x.com" });

    expect(userRepo.save).not.toHaveBeenCalled();
    expect(mockedEmailService.sendPasswordReset).not.toHaveBeenCalled();
  });

  it("saves reset token and sends email when user exists", async () => {
    const mockUser = {
      id: "u-1",
      email: "x@x.com",
      name: "Test User",
      updateResetToken: vi.fn(),
    };
    userRepo.findByEmail.mockResolvedValue(mockUser);

    await useCase.execute({ email: "x@x.com" });

    expect(mockUser.updateResetToken).toHaveBeenCalledOnce();
    expect(userRepo.save).toHaveBeenCalledOnce();
    expect(mockedEmailService.sendPasswordReset).toHaveBeenCalledOnce();
    expect(mockedEmailService.sendPasswordReset).toHaveBeenCalledWith(
      "x@x.com",
      "Test User",
      expect.any(String),
    );
  });

  it("does not throw when email service fails", async () => {
    const mockUser = {
      id: "u-1",
      email: "x@x.com",
      name: "Test User",
      updateResetToken: vi.fn(),
    };
    userRepo.findByEmail.mockResolvedValue(mockUser);
    mockedEmailService.sendPasswordReset.mockRejectedValueOnce(
      new Error("SMTP down"),
    );

    await expect(
      useCase.execute({ email: "x@x.com" }),
    ).resolves.toBeUndefined();

    expect(userRepo.save).toHaveBeenCalledOnce();
  });
});
