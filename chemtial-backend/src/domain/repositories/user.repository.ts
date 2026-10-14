import { User } from "../entities/user.entity.js";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
  }): Promise<{ data: User[]; total: number }>;
  updateRole(id: string, role: string): Promise<User>;
  updateLastSeen(id: string): Promise<void>;
}
