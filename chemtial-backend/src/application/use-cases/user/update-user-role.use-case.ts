import { UserRepository } from "../../../domain/repositories/user.repository.js";
import {
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../../../shared/exceptions/app.error.js";
import { ROLES, ALL_ROLES } from "../../../shared/constants/roles.js";

export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    targetUserId: string,
    newRole: string,
    actorId: string,
    actorRole: string,
  ) {
    if (!ALL_ROLES.includes(newRole as any)) {
      throw new ValidationError(
        `Invalid role. Allowed: ${ALL_ROLES.join(", ")}`,
      );
    }

    if (actorRole !== ROLES.MANAGER) {
      throw new ForbiddenError("Only manager can change user roles");
    }

    if (targetUserId === actorId) {
      throw new ForbiddenError("Manager cannot change their own role");
    }

    const target = await this.userRepository.findById(targetUserId);
    if (!target) {
      throw new NotFoundError("User", targetUserId);
    }

    if (target.role === ROLES.MANAGER) {
      throw new ForbiddenError("Cannot change another manager's role");
    }

    const updated = await this.userRepository.updateRole(targetUserId, newRole);

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    };
  }
}
