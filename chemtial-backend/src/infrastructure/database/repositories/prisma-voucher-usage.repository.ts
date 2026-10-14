import { prisma } from "../prisma/client.js";
import {
  VoucherUsageEntry,
  VoucherUsageRepository,
} from "../../../domain/repositories/voucher-usage.repository.js";

export class PrismaVoucherUsageRepository implements VoucherUsageRepository {
  async claim(voucherId: string, userId: string): Promise<VoucherUsageEntry> {
    const usage = await prisma.voucherUsage.create({
      data: {
        voucherId,
        userId,
        status: "claimed",
      },
      include: { voucher: true },
    });

    return this.toDomain(usage);
  }

  async findById(id: string): Promise<VoucherUsageEntry | null> {
    const usage = await prisma.voucherUsage.findUnique({
      where: { id },
      include: { voucher: true },
    });
    if (!usage) return null;
    return this.toDomain(usage);
  }

  async findByUser(
    userId: string,
    status?: string,
  ): Promise<VoucherUsageEntry[]> {
    const where: any = { userId };
    if (status) where.status = status;

    const usages = await prisma.voucherUsage.findMany({
      where: {
        ...where,
        voucher: {
          deletedAt: null,
        },
      },
      include: { voucher: true },
      orderBy: { claimedAt: "desc" },
    });

    return usages.map((u) => this.toDomain(u));
  }

  async findActiveClaimedByUser(userId: string): Promise<VoucherUsageEntry[]> {
    const now = new Date();
    const usages = await prisma.voucherUsage.findMany({
      where: {
        userId,
        status: "claimed",
        voucher: {
          deletedAt: null,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: { voucher: true },
      orderBy: { claimedAt: "desc" },
    });

    return usages.map((u) => this.toDomain(u));
  }

  async findByUserAndVoucher(
    userId: string,
    voucherId: string,
  ): Promise<VoucherUsageEntry | null> {
    const usage = await prisma.voucherUsage.findFirst({
      where: { userId, voucherId },
      include: { voucher: true },
    });
    if (!usage) return null;
    return this.toDomain(usage);
  }

  async markUsed(
    id: string,
    orderId: string,
    discountAmount: number,
  ): Promise<VoucherUsageEntry> {
    const usage = await prisma.voucherUsage.update({
      where: { id },
      data: {
        status: "used",
        orderId,
        discountAmount,
        usedAt: new Date(),
      },
      include: { voucher: true },
    });

    return this.toDomain(usage);
  }

  async markReturned(id: string): Promise<VoucherUsageEntry> {
    const usage = await prisma.voucherUsage.update({
      where: { id },
      data: {
        status: "claimed",
        orderId: null,
        discountAmount: null,
        usedAt: null,
      },
      include: { voucher: true },
    });

    return this.toDomain(usage);
  }

  async findUsedByOrderId(orderId: string): Promise<VoucherUsageEntry | null> {
    const usage = await prisma.voucherUsage.findFirst({
      where: { orderId, status: "used" },
      include: { voucher: true },
    });
    if (!usage) return null;
    return this.toDomain(usage);
  }

  private toDomain(data: any): VoucherUsageEntry {
    return {
      id: data.id,
      voucherId: data.voucherId,
      userId: data.userId,
      orderId: data.orderId,
      status: data.status,
      discountAmount: data.discountAmount,
      claimedAt: data.claimedAt,
      usedAt: data.usedAt,
      voucher: data.voucher
        ? {
            id: data.voucher.id,
            code: data.voucher.code,
            title: data.voucher.title,
            description: data.voucher.description,
            type: data.voucher.type,
            category: data.voucher.category,
            value: data.voucher.value,
            minPurchase: data.voucher.minPurchase,
            maxDiscount: data.voucher.maxDiscount,
            startDate: data.voucher.startDate,
            endDate: data.voucher.endDate,
            usageLimit: data.voucher.usageLimit,
            usageCount: data.voucher.usageCount,
            perUserLimit: data.voucher.perUserLimit,
            isActive: data.voucher.isActive,
          }
        : undefined,
    };
  }
}
