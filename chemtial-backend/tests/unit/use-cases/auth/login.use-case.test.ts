import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUseCase } from "../../../../src/application/use-cases/auth/login.use-case";
import { User } from "../../../../src/domain/entities/user.entity";
import { UnauthorizedError } from "../../../../src/shared/exceptions/app.error";

const makeUser = (
  overrides: Partial<{ active: boolean; pwHash: string }> = {},
) =>
  new User(
    "u-1",
    "John",
    "john@example.com",
    overrides.pwHash ?? "hashed",
    "user",
    overrides.active ?? true,
    null,
    null,
    null,
    new Date(),
    new Date(),
  );

describe("LoginUseCase", () => {
  let userRepo: any;
  let passwordService: any;
  let jwtService: any;
  let useCase: LoginUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    passwordService = {
      verify: vi.fn(),
      hash: vi.fn(),
    };
    jwtService = {
      generateAccessToken: vi.fn().mockReturnValue("at"),
      generateRefreshToken: vi.fn().mockReturnValue("rt"),
      getRefreshTokenExpiryDate: vi.fn().mockReturnValue(new Date()),
    };
    useCase = new LoginUseCase(userRepo, passwordService, jwtService);
  });

  it("should throw when user not found", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    await expect(
      useCase.execute({ email: "x@x.com", password: "Pass123!" }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw when account deactivated", async () => {
    userRepo.findByEmail.mockResolvedValue(makeUser({ active: false }));
    await expect(
      useCase.execute({ email: "john@example.com", password: "Pass123!" }),
    ).rejects.toThrow("Account is deactivated");
  });

  it("should throw when password invalid", async () => {
    userRepo.findByEmail.mockResolvedValue(makeUser());
    passwordService.verify.mockResolvedValue(false);
    await expect(
      useCase.execute({ email: "john@example.com", password: "wrong" }),
    ).rejects.toThrow("Invalid email or password");
  });

  it("should return tokens on valid credentials", async () => {
    userRepo.findByEmail.mockResolvedValue(makeUser());
    passwordService.verify.mockResolvedValue(true);
    const res = await useCase.execute({
      email: "john@example.com",
      password: "Pass123!",
    });
    expect(res.accessToken).toBe("at");
    expect(res.refreshToken).toBe("rt");
    expect(res.user.email).toBe("john@example.com");
    expect(userRepo.save).toHaveBeenCalledOnce();
  });
});
