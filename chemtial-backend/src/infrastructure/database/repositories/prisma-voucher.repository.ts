import { Voucher } from "@prisma/client";
import { prisma } from "../prisma/client";
import { VoucherRepository } from "../../../domain/repositories/voucher.repository";

export class PrismaVoucherRepository implements VoucherRepository {
  async findById(id: string): Promise<Voucher | null> {
    return prisma.voucher.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return prisma.voucher.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async findAll(params: {
    isActive?: boolean;
    search?: string;
    category?: string;
  }): Promise<Voucher[]> {
    const { isActive, search, category } = params;

    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.voucher.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findActive(category?: string): Promise<Voucher[]> {
    const now = new Date();
    const where: any = {
      deletedAt: null,
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    };
    if (category) where.category = category;

    return prisma.voucher.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
  async findAllPaginated(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Voucher[]; total: number }> {
    const { page, limit, isActive, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.voucher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.voucher.count({ where }),
    ]);

    return { data, total };
  }

  async save(voucher: Voucher): Promise<Voucher> {
    return prisma.voucher.create({
      data: {
        id: voucher.id,
        code: voucher.code,
        title: voucher.title,
        description: voucher.description,
        type: voucher.type,
        category: voucher.category,
        value: voucher.value,
        minPurchase: voucher.minPurchase,
        maxDiscount: voucher.maxDiscount,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        usageCount: voucher.usageCount,
        perUserLimit: voucher.perUserLimit,
      },
    });
  }

  async update(id: string, data: Partial<Voucher>): Promise<Voucher> {
    return prisma.voucher.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.voucher.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async incrementUsage(id: string): Promise<void> {
    await prisma.voucher.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}
