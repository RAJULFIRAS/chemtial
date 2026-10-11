import { Banner } from "@prisma/client";
import { prisma } from "../prisma/client";
import { BannerRepository } from "../../../domain/repositories/banner.repository";

export class PrismaBannerRepository implements BannerRepository {
  async findById(id: string): Promise<Banner | null> {
    return prisma.banner.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findAll(params: {
    position?: string;
    activeNow?: boolean;
  }): Promise<Banner[]> {
    const { position } = params;
    const where: any = { deletedAt: null };
    if (position) where.position = position;

    return prisma.banner.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async findActive(position?: string): Promise<Banner[]> {
    const now = new Date();
    const where: any = {
      deletedAt: null,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
      ],
    };

    if (position) where.position = position;

    return prisma.banner.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }

  async save(banner: Banner): Promise<Banner> {
    return prisma.banner.create({
      data: {
        id: banner.id,
        file: banner.file,
        mediaType: banner.mediaType,
        position: banner.position,
        sortOrder: banner.sortOrder,
        startDate: banner.startDate,
        endDate: banner.endDate,
      },
    });
  }

  async update(id: string, data: Partial<Banner>): Promise<Banner> {
    return prisma.banner.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
