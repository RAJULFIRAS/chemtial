import { DownloadRepository } from "../../../domain/repositories/download.repository.js";
import { DownloadStatsResponse } from "../../dtos/download.dto.js";

export class GetDownloadStatsUseCase {
  constructor(private readonly downloadRepository: DownloadRepository) {}

  async execute(): Promise<DownloadStatsResponse> {
    return this.downloadRepository.getStats();
  }
}
