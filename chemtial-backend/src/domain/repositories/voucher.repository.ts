import { Voucher } from "@prisma/client";

export interface VoucherRepository {
  findById(id: string): Promise<Voucher | null>;
  findByCode(code: string): Promise<Voucher | null>;
  findAll(params: {
    isActive?: boolean;
    search?: string;
    category?: string;
  }): Promise<Voucher[]>;
  findActive(category?: string): Promise<Voucher[]>;
  save(voucher: Voucher): Promise<Voucher>;
  update(id: string, data: Partial<Voucher>): Promise<Voucher>;
  delete(id: string): Promise<void>;
  incrementUsage(id: string): Promise<void>;
}
