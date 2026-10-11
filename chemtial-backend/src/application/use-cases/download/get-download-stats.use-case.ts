import { DownloadRepository } from "../../../domain/repositories/download.repository";
import { DownloadStatsResponse } from "../../dtos/download.dto";

export class GetDownloadStatsUseCase {
  constructor(private readonly downloadRepository: DownloadRepository) {}

  async execute(): Promise<DownloadStatsResponse> {
    return this.downloadRepository.getStats();
  }
}
