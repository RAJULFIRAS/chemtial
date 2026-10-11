import { Product } from "../../../domain/entities/product.entity";
import { ProductRepository } from "../../../domain/repositories/product.repository";
import { prisma } from "../prisma/client";

export class PrismaProductRepository implements ProductRepository {
  async findById(id: string): Promise<Product | null> {
    const data = await prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        units: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!data) return null;
    return this.toDomain(data);
  }

  async findAll(params: {
    page: number;
    limit: number;
    category?: string;
    brand?: string;
    search?: string;
    isPromo?: boolean;
    recent?: boolean;
  }): Promise<{ data: Product[]; total: number }> {
    const { page, limit, category, brand, search, isPromo } = params;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (category) where.categoryId = category;
    if (brand) where.brandId = brand;
    if (isPromo !== undefined) where.isPromo = isPromo;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameEn: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          units: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: data.map((item: any) => this.toDomain(item)),
      total,
    };
  }

  async save(product: Product): Promise<Product> {
    const data = await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        nameEn: product.nameEn,
        nameZh: product.nameZh,
        nameHi: product.nameHi,
        nameRu: product.nameRu,
        nameAr: product.nameAr,
        description: product.description,
        descriptionEn: product.descriptionEn,
        descriptionZh: product.descriptionZh,
        descriptionHi: product.descriptionHi,
        descriptionRu: product.descriptionRu,
        descriptionAr: product.descriptionAr,
        brand: product.brand,
        brandId: product.brandId,
        category: product.category,
        categoryId: product.categoryId,
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        unit: product.unit,
        isPromo: product.isPromo,
        promoDiscount: product.promoDiscount,
        casNumber: product.casNumber,
        updatedAt: new Date(),
        deletedAt: product.deletedAt,
      },
      create: {
        id: product.id,
        name: product.name,
        nameEn: product.nameEn,
        nameZh: product.nameZh,
        nameHi: product.nameHi,
        nameRu: product.nameRu,
        nameAr: product.nameAr,
        description: product.description,
        descriptionEn: product.descriptionEn,
        descriptionZh: product.descriptionZh,
        descriptionHi: product.descriptionHi,
        descriptionRu: product.descriptionRu,
        descriptionAr: product.descriptionAr,
        brand: product.brand,
        brandId: product.brandId,
        category: product.category,
        categoryId: product.categoryId,
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        unit: product.unit,
        isPromo: product.isPromo,
        promoDiscount: product.promoDiscount,
        casNumber: product.casNumber,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        units: { orderBy: { sortOrder: "asc" } },
      },
    });
    return this.toDomain(data);
  }

  async update(id: string, data: any): Promise<Product> {
    const result = await prisma.product.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        units: { orderBy: { sortOrder: "asc" } },
      },
    });
    return this.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async replaceImages(productId: string, imagePaths: string[]): Promise<void> {
    const limited = imagePaths.slice(0, 10);

    await prisma.$transaction([
      prisma.productImage.deleteMany({
        where: { productId },
      }),
      prisma.productImage.createMany({
        data: limited.map((image, index) => ({
          productId,
          image,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      }),
      prisma.product.update({
        where: { id: productId },
        data: { image: limited[0] || "" },
      }),
    ]);
  }

  async replaceUnits(
    productId: string,
    units: { unit: string; price: number; stock: number }[],
  ): Promise<void> {
    await prisma.$transaction([
      prisma.productUnit.deleteMany({
        where: { productId },
      }),
      prisma.productUnit.createMany({
        data: units.map((u, index) => ({
          productId,
          unit: u.unit,
          price: u.price,
          stock: u.stock,
          sortOrder: index,
          isActive: true,
        })),
      }),
    ]);
  }

  private toDomain(data: any): Product {
    return new Product(
      data.id,
      data.name,
      data.nameEn,
      data.nameZh,
      data.nameHi,
      data.nameRu,
      data.nameAr,
      data.description,
      data.descriptionEn,
      data.descriptionZh,
      data.descriptionHi,
      data.descriptionRu,
      data.descriptionAr,
      data.brand,
      data.brandId,
      data.category,
      data.categoryId,
      data.price,
      data.image,
      data.rating,
      data.reviews,
      data.unit,
      data.isPromo,
      data.promoDiscount,
      data.casNumber,
      data.createdAt,
      data.updatedAt,
      data.deletedAt,
      (data.images || []).map((img: any) => ({
        id: img.id,
        image: img.image,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      (data.units || []).map((u: any) => ({
        id: u.id,
        unit: u.unit,
        price: u.price,
        stock: u.stock,
        isActive: u.isActive,
      })),
    );
  }
}
