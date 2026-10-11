import { UserRepository } from "../../../domain/repositories/user.repository";
import { PasswordService } from "../../../infrastructure/auth/password.service";
import { JwtService } from "../../../infrastructure/auth/jwt.service";
import { LoginDTO, AuthResponse } from "../../dtos/auth.dto";
import { UnauthorizedError } from "../../../shared/exceptions/app.error";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const isValid = await this.passwordService.verify(
      input.password,
      user.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshExpiry = this.jwtService.getRefreshTokenExpiryDate();

    user.updateRefreshToken(refreshToken, refreshExpiry);
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
