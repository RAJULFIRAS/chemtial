import { UserRepository } from "../../../domain/repositories/user.repository.js";
import { UserQueryDTO } from "../../dtos/user.dto.js";
import { ROLE_HIERARCHY, Role } from "../../../shared/constants/roles.js";

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: UserQueryDTO) {
    const result = await this.userRepository.findAll(query);

    const sorted = [...result.data].sort((a, b) => {
      const aWeight = ROLE_HIERARCHY[a.role as Role] || 0;
      const bWeight = ROLE_HIERARCHY[b.role as Role] || 0;
      if (aWeight !== bWeight) return bWeight - aWeight;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return {
      data: sorted.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        lastSeen: u.lastSeen,
        createdAt: u.createdAt,
      })),
      total: result.total,
    };
  }
}
