import { prisma } from "../prisma/client";
import { DownloadRepository } from "../../../domain/repositories/download.repository";
import {
  DownloadAnalytics,
  DailyDownloadStats,
} from "../../../application/use-cases/download/get-download-analytics.use-case";

export class PrismaDownloadRepository implements DownloadRepository {
  async track(data: {
    platform: string;
    userId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
  }): Promise<void> {
    await prisma.downloadTracking.create({
      data: {
        platform: data.platform,
        userId: data.userId ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        referrer: data.referrer ?? null,
      },
    });
  }

  async getStats(): Promise<{
    playstore: number;
    appstore: number;
    total: number;
  }> {
    const [playstore, appstore, total] = await Promise.all([
      prisma.downloadTracking.count({ where: { platform: "playstore" } }),
      prisma.downloadTracking.count({ where: { platform: "appstore" } }),
      prisma.downloadTracking.count(),
    ]);

    return { playstore, appstore, total };
  }

  async getDailyStats(days: number): Promise<DownloadAnalytics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const records = await prisma.downloadTracking.findMany({
      where: { createdAt: { gte: startDate } },
      select: { platform: true, createdAt: true },
    });

    const grouped: Record<string, DailyDownloadStats> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateKey = date.toISOString().slice(0, 10);
      grouped[dateKey] = {
        date: dateKey,
        playstore: 0,
        appstore: 0,
        total: 0,
      };
    }

    for (const record of records) {
      const dateKey = record.createdAt.toISOString().slice(0, 10);
      if (!grouped[dateKey]) continue;

      if (record.platform === "playstore") {
        grouped[dateKey].playstore++;
      } else if (record.platform === "appstore") {
        grouped[dateKey].appstore++;
      }
      grouped[dateKey].total++;
    }

    const daily = Object.values(grouped).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const total = await this.getStats();

    return { total, daily };
  }
}
