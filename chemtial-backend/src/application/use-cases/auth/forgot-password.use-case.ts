import crypto from "crypto";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { ForgotPasswordDTO } from "../../dtos/password-reset.dto";

export class ForgotPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: ForgotPasswordDTO): Promise<{ resetToken?: string }> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      return {};
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    user.updateResetToken(token, expiry);
    await this.userRepository.save(user);

    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset token for ${user.email}: ${token}`);
      return { resetToken: token };
    }

    return {};
  }
}
