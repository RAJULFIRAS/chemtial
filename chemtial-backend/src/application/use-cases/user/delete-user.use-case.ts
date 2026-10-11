import { UserRepository } from "../../../domain/repositories/user.repository";
import {
  NotFoundError,
  ForbiddenError,
} from "../../../shared/exceptions/app.error";
import { ROLES } from "../../../shared/constants/roles";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(targetUserId: string, actorId: string): Promise<void> {
    if (targetUserId === actorId) {
      throw new ForbiddenError("Cannot delete your own account");
    }

    const existing = await this.userRepository.findById(targetUserId);
    if (!existing) {
      throw new NotFoundError("User", targetUserId);
    }

    if (existing.role === ROLES.MANAGER) {
      throw new ForbiddenError("Manager account cannot be deleted");
    }

    await this.userRepository.delete(targetUserId);
  }
}
