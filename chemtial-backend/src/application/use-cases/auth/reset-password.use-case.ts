import { UserRepository } from "../../../domain/repositories/user.repository";
import { PasswordService } from "../../../infrastructure/auth/password.service";
import { ResetPasswordDTO } from "../../dtos/password-reset.dto";
import { ValidationError } from "../../../shared/exceptions/app.error";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(input: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByResetToken(input.token);

    if (!user) {
      throw new ValidationError("Invalid or expired reset token");
    }

    if (!user.resetTokenExp || new Date() > user.resetTokenExp) {
      throw new ValidationError("Reset token has expired");
    }

    const hashedPassword = await this.passwordService.hash(input.newPassword);
    user.updatePassword(hashedPassword);

    await this.userRepository.save(user);
  }
}
