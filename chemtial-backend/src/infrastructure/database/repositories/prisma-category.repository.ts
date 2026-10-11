import { Category } from "@prisma/client";
import { prisma } from "../prisma/client";
import { CategoryRepository } from "../../../domain/repositories/category.repository";

export class PrismaCategoryRepository implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { slug, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async findAll(params: {
    isActive?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<Category[]> {
    const {
      isActive,
      search,
      sortBy = "sortOrder",
      sortOrder = "asc",
    } = params;

    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    return prisma.category.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: { _count: { select: { products: true } } },
    });
  }

  async findAllPaginated(params: {
    page: number;
    limit: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Category[]; total: number }> {
    const { page, limit, isActive, search } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async save(category: any): Promise<any> {
    return prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        nameEn: category.nameEn,
        nameZh: category.nameZh,
        nameHi: category.nameHi,
        nameRu: category.nameRu,
        nameAr: category.nameAr,
        slug: category.slug,
        sortOrder: category.sortOrder,
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        nameEn: data.nameEn,
        nameZh: data.nameZh,
        nameHi: data.nameHi,
        nameRu: data.nameRu,
        nameAr: data.nameAr,
        slug: data.slug,
        sortOrder: data.sortOrder,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
