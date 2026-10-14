import { Brand } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { BrandRepository } from "../../../domain/repositories/brand.repository.js";

export class PrismaBrandRepository implements BrandRepository {
  async findById(id: string): Promise<Brand | null> {
    return prisma.brand.findFirst({
      where: { id, deletedAt: null },
      include: { _count: { select: { products: true } } },
    });
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return prisma.brand.findFirst({
      where: { slug, deletedAt: null },
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return prisma.brand.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async findAll(params: { search?: string }): Promise<Brand[]> {
    const { search } = params;
    const where: any = { deletedAt: null };
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    return prisma.brand.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async save(brand: Brand): Promise<Brand> {
    return prisma.brand.create({
      data: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        sortOrder: brand.sortOrder,
      },
    });
  }

  async update(id: string, data: Partial<Brand>): Promise<Brand> {
    return prisma.brand.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.brand.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
