import crypto from "crypto";
import { UserRepository } from "../../../domain/repositories/user.repository.js";
import { ForgotPasswordDTO } from "../../dtos/password-reset.dto.js";
import { emailService } from "../../../infrastructure/email/email.service.js";
import { logger } from "../../../shared/utils/logger.js";

export class ForgotPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: ForgotPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      logger.info(
        `[ForgotPassword] Reset requested for unknown email: ${input.email}`,
      );
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    user.updateResetToken(token, expiry);
    await this.userRepository.save(user);

    try {
      await emailService.sendPasswordReset(user.email, user.name, token);
      logger.info(`[ForgotPassword] Reset email sent to ${user.email}`);
    } catch (error) {
      logger.error(
        { err: error },
        `[ForgotPassword] Failed to send email to ${user.email}`,
      );
    }
  }
}
