import { DownloadAnalytics } from "../../application/use-cases/download/get-download-analytics.use-case";

export interface DownloadRepository {
  track(data: {
    platform: string;
    userId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    referrer?: string | null;
  }): Promise<void>;
  getStats(): Promise<{ playstore: number; appstore: number; total: number }>;
  getDailyStats(days: number): Promise<DownloadAnalytics>;
}
