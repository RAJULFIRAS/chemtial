import { Promo } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { PromoRepository } from "../../../domain/repositories/promo.repository.js";

export class PrismaPromoRepository implements PromoRepository {
  async findById(id: string): Promise<Promo | null> {
    return prisma.promo.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByCode(code: string): Promise<Promo | null> {
    return prisma.promo.findFirst({
      where: { code, deletedAt: null },
    });
  }

  async findAll(params: {
    isActive?: boolean;
    search?: string;
  }): Promise<Promo[]> {
    const { isActive, search } = params;

    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.promo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findActive(): Promise<Promo[]> {
    const now = new Date();
    return prisma.promo.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllPaginated(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Promo[]; total: number }> {
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
      prisma.promo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.promo.count({ where }),
    ]);

    return { data, total };
  }

  async save(promo: Promo): Promise<Promo> {
    return prisma.promo.create({
      data: {
        id: promo.id,
        title: promo.title,
        description: promo.description,
        code: promo.code,
        type: promo.type,
        value: promo.value,
        minPurchase: promo.minPurchase,
        maxDiscount: promo.maxDiscount,
        image: promo.image,
        bannerUrl: promo.bannerUrl,
        startDate: promo.startDate,
        endDate: promo.endDate,
        usageLimit: promo.usageLimit,
        usageCount: promo.usageCount,
        isActive: promo.isActive,
      },
    });
  }

  async update(id: string, data: Partial<Promo>): Promise<Promo> {
    return prisma.promo.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.promo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async incrementUsage(id: string): Promise<void> {
    await prisma.promo.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }
}
