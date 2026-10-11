import { Promo } from "@prisma/client";

export interface PromoRepository {
  findById(id: string): Promise<Promo | null>;
  findByCode(code: string): Promise<Promo | null>;
  findAll(params: { isActive?: boolean; search?: string }): Promise<Promo[]>;
  findActive(): Promise<Promo[]>;
  findAllPaginated(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Promo[]; total: number }>;
  save(promo: Promo): Promise<Promo>;
  update(id: string, data: Partial<Promo>): Promise<Promo>;
  delete(id: string): Promise<void>;
  incrementUsage(id: string): Promise<void>;
}
