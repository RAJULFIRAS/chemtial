import { Category } from "@prisma/client";

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(params: {
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<Category[]>;
  findAllPaginated(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Category[]; total: number }>;
  save(category: Category): Promise<Category>;
  update(id: string, data: Partial<Category>): Promise<Category>;
  delete(id: string): Promise<void>;
}
