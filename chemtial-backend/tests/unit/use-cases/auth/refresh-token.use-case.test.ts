import { describe, it, expect, vi, beforeEach } from "vitest";
import { RefreshTokenUseCase } from "../../../../src/application/use-cases/auth/refresh-token.use-case";
import { UnauthorizedError } from "../../../../src/shared/exceptions/app.error";

const makeUser = () =>
  ({
    id: "u-1",
    email: "a@b.com",
    role: "user",
    name: "A",
    refreshToken: "valid-token",
    refreshTokenExp: new Date(Date.now() + 86400000),
    isActive: true,
    updateRefreshToken: vi.fn(),
  }) as any;

describe("RefreshTokenUseCase", () => {
  let userRepo: any;
  let jwtService: any;
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    userRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };
    jwtService = {
      verifyRefreshToken: vi.fn(),
      generateAccessToken: vi.fn().mockReturnValue("new-at"),
      generateRefreshToken: vi.fn().mockReturnValue("new-rt"),
      getRefreshTokenExpiryDate: vi.fn().mockReturnValue(new Date()),
    };
    useCase = new RefreshTokenUseCase(userRepo, jwtService);
  });

  it("throws on invalid token", async () => {
    jwtService.verifyRefreshToken.mockImplementation(() => {
      throw new Error("invalid");
    });
    await expect(useCase.execute({ refreshToken: "bad" })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("throws when user not found", async () => {
    jwtService.verifyRefreshToken.mockReturnValue({
      id: "u-1",
      email: "a@b.com",
      role: "user",
    });
    userRepo.findById.mockResolvedValue(null);
    await expect(useCase.execute({ refreshToken: "ok" })).rejects.toThrow(
      "User not found",
    );
  });

  it("throws when token mismatch", async () => {
    jwtService.verifyRefreshToken.mockReturnValue({
      id: "u-1",
      email: "a@b.com",
      role: "user",
    });
    userRepo.findById.mockResolvedValue({
      ...makeUser(),
      refreshToken: "other",
    });
    await expect(useCase.execute({ refreshToken: "ok" })).rejects.toThrow(
      "revoked",
    );
  });

  it("throws when token expired", async () => {
    jwtService.verifyRefreshToken.mockReturnValue({
      id: "u-1",
      email: "a@b.com",
      role: "user",
    });
    userRepo.findById.mockResolvedValue({
      ...makeUser(),
      refreshTokenExp: new Date(Date.now() - 1000),
    });
    await expect(
      useCase.execute({ refreshToken: "valid-token" }),
    ).rejects.toThrow("expired");
  });

  it("throws when account deactivated", async () => {
    jwtService.verifyRefreshToken.mockReturnValue({
      id: "u-1",
      email: "a@b.com",
      role: "user",
    });
    userRepo.findById.mockResolvedValue({
      ...makeUser(),
      isActive: false,
    });
    await expect(
      useCase.execute({ refreshToken: "valid-token" }),
    ).rejects.toThrow("deactivated");
  });

  it("returns new tokens on success", async () => {
    jwtService.verifyRefreshToken.mockReturnValue({
      id: "u-1",
      email: "a@b.com",
      role: "user",
    });
    userRepo.findById.mockResolvedValue(makeUser());
    const res = await useCase.execute({ refreshToken: "valid-token" });
    expect(res.accessToken).toBe("new-at");
    expect(res.refreshToken).toBe("new-rt");
  });
});
