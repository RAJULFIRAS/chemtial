import { User } from "../../../domain/entities/user.entity.js";
import { UserRepository } from "../../../domain/repositories/user.repository.js";
import { PasswordService } from "../../../infrastructure/auth/password.service.js";
import { JwtService } from "../../../infrastructure/auth/jwt.service.js";
import { RegisterDTO, AuthResponse } from "../../dtos/auth.dto.js";
import { ConflictError } from "../../../shared/exceptions/app.error.js";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await this.passwordService.hash(input.password);

    const user = new User(
      crypto.randomUUID(),
      input.name,
      input.email,
      hashedPassword,
      "user",
      true,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    await this.userRepository.save(user);

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
