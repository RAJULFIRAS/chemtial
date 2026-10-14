import { UserRepository } from "../../../domain/repositories/user.repository.js";
import { JwtService } from "../../../infrastructure/auth/jwt.service.js";
import { RefreshTokenDTO, AuthResponse } from "../../dtos/auth.dto.js";
import { UnauthorizedError } from "../../../shared/exceptions/app.error.js";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RefreshTokenDTO): Promise<AuthResponse> {
    let decoded: { id: string; email: string; role: string };
    try {
      decoded = this.jwtService.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    const user = await this.userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.refreshToken !== input.refreshToken) {
      throw new UnauthorizedError("Refresh token has been revoked");
    }

    if (user.refreshTokenExp && new Date() > user.refreshTokenExp) {
      throw new UnauthorizedError("Refresh token expired");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const newAccessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshExpiry = this.jwtService.getRefreshTokenExpiryDate();

    user.updateRefreshToken(newRefreshToken, refreshExpiry);
    await this.userRepository.save(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
