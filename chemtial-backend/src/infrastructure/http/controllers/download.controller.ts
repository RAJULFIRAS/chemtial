import { Request, Response, NextFunction } from "express";
import { TrackDownloadUseCase } from "../../../application/use-cases/download/track-download.use-case.js";
import { GetDownloadStatsUseCase } from "../../../application/use-cases/download/get-download-stats.use-case.js";
import { GetDownloadAnalyticsUseCase } from "../../../application/use-cases/download/get-download-analytics.use-case.js";
import { trackDownloadSchema } from "../../../application/dtos/download.dto.js";

export class DownloadController {
  constructor(
    private readonly trackDownloadUseCase: TrackDownloadUseCase,
    private readonly getDownloadStatsUseCase: GetDownloadStatsUseCase,
    private readonly getDownloadAnalyticsUseCase: GetDownloadAnalyticsUseCase,
  ) {}

  async track(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = trackDownloadSchema.parse(req.body);
      await this.trackDownloadUseCase.execute({
        ...validated,
        userId: (req as any).user?.id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      });
      res.status(201).json({ success: true, message: "Tracked" });
    } catch (error) {
      next(error);
    }
  }

  async getStats(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await this.getDownloadStatsUseCase.execute();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const analytics = await this.getDownloadAnalyticsUseCase.execute(days);
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}
