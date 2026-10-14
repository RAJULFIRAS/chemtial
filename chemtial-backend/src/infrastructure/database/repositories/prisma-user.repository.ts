import { User } from "../../../domain/entities/user.entity.js";
import { UserRepository } from "../../../domain/repositories/user.repository.js";
import { prisma } from "../prisma/client.js";

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async save(user: User): Promise<User> {
    const data = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
        refreshToken: user.refreshToken,
        refreshTokenExp: user.refreshTokenExp,
        lastSeen: user.lastSeen,
        updatedAt: new Date(),
        deletedAt: user.deletedAt,
        resetToken: user.resetToken,
        resetTokenExp: user.resetTokenExp,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
        refreshToken: user.refreshToken,
        refreshTokenExp: user.refreshTokenExp,
        lastSeen: user.lastSeen,
        resetToken: user.resetToken,
        resetTokenExp: user.resetTokenExp,
      },
    });
    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findByResetToken(token: string): Promise<User | null> {
    const data = await prisma.user.findFirst({
      where: { resetToken: token, deletedAt: null },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
  }): Promise<{ data: User[]; total: number }> {
    const { page, limit, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: data.map((item: any) => this.toDomain(item)),
      total,
    };
  }

  async updateRole(id: string, role: string): Promise<User> {
    const data = await prisma.user.update({
      where: { id },
      data: { role, updatedAt: new Date() },
    });
    return this.toDomain(data);
  }

  async updateLastSeen(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastSeen: new Date() },
    });
  }

  private toDomain(data: any): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.passwordHash,
      data.role,
      data.isActive,
      data.refreshToken,
      data.refreshTokenExp,
      data.lastSeen,
      data.createdAt,
      data.updatedAt,
      data.deletedAt,
      data.resetToken,
      data.resetTokenExp,
    );
  }
}
