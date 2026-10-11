import { DownloadRepository } from "../../../domain/repositories/download.repository";
import { TrackDownloadDTO } from "../../dtos/download.dto";

export class TrackDownloadUseCase {
  constructor(private readonly downloadRepository: DownloadRepository) {}

  async execute(
    data: TrackDownloadDTO & {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
    },
  ): Promise<void> {
    await this.downloadRepository.track({
      platform: data.platform,
      userId: data.userId ?? null,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      referrer: data.referrer ?? null,
    });
  }
}
