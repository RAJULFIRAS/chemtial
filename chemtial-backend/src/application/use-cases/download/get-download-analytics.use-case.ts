import { DownloadRepository } from "../../../domain/repositories/download.repository.js";

export interface DailyDownloadStats {
  date: string;
  playstore: number;
  appstore: number;
  total: number;
}

export interface DownloadAnalytics {
  total: {
    playstore: number;
    appstore: number;
    total: number;
  };
  daily: DailyDownloadStats[];
}

export class GetDownloadAnalyticsUseCase {
  constructor(private readonly downloadRepository: DownloadRepository) {}

  async execute(days: number = 30): Promise<DownloadAnalytics> {
    const analytics = await this.downloadRepository.getDailyStats(days);
    return analytics;
  }
}
