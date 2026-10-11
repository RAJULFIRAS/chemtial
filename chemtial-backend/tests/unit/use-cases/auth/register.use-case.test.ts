import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterUseCase } from "../../../../src/application/use-cases/auth/register.use-case";
import { ConflictError } from "../../../../src/shared/exceptions/app.error";

describe("RegisterUseCase", () => {
  let userRepo: any;
  let passwordService: any;
  let jwtService: any;
  let useCase: RegisterUseCase;

  beforeEach(() => {
    userRepo = {
      findByEmail: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    passwordService = { hash: vi.fn().mockResolvedValue("hashed") };
    jwtService = {
      generateAccessToken: vi.fn().mockReturnValue("at"),
      generateRefreshToken: vi.fn().mockReturnValue("rt"),
      getRefreshTokenExpiryDate: vi.fn().mockReturnValue(new Date()),
    };
    useCase = new RegisterUseCase(userRepo, passwordService, jwtService);
  });

  it("should throw when email already exists", async () => {
    userRepo.findByEmail.mockResolvedValue({});
    await expect(
      useCase.execute({
        name: "John",
        email: "j@j.com",
        password: "Pass123!",
      }),
    ).rejects.toThrow(ConflictError);
  });

  it("should register new user", async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    const res = await useCase.execute({
      name: "John",
      email: "j@j.com",
      password: "Pass123!",
    });
    expect(res.accessToken).toBe("at");
    expect(userRepo.save).toHaveBeenCalledTimes(2);
  });
});
