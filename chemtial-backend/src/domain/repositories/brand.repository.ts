import { Brand } from "@prisma/client";

export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findAll(params: { search?: string }): Promise<Brand[]>;
  save(brand: Brand): Promise<Brand>;
  update(id: string, data: Partial<Brand>): Promise<Brand>;
  delete(id: string): Promise<void>;
}
