import { Request, Response, NextFunction } from "express";
import { GetBannersUseCase } from "../../../application/use-cases/banner/get-banners.use-case.js";
import { GetBannerByIdUseCase } from "../../../application/use-cases/banner/get-banner-by-id.use-case.js";
import { CreateBannerUseCase } from "../../../application/use-cases/banner/create-banner.use-case.js";
import { UpdateBannerUseCase } from "../../../application/use-cases/banner/update-banner.use-case.js";
import { DeleteBannerUseCase } from "../../../application/use-cases/banner/delete-banner.use-case.js";
import {
  createBannerSchema,
  updateBannerSchema,
} from "../../../application/dtos/banner.dto.js";

export class BannerController {
  constructor(
    private readonly getBannersUseCase: GetBannersUseCase,
    private readonly getBannerByIdUseCase: GetBannerByIdUseCase,
    private readonly createBannerUseCase: CreateBannerUseCase,
    private readonly updateBannerUseCase: UpdateBannerUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { position, activeNow } = req.query;
      const banners = await this.getBannersUseCase.execute({
        position: position as string,
        onlyActiveNow: activeNow === "true",
      });
      res.json({ success: true, data: banners });
    } catch (error) {
      next(error);
    }
  }
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const banner = await this.getBannerByIdUseCase.execute(id);
      res.json({ success: true, data: banner });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createBannerSchema.parse(req.body);
      const banner = await this.createBannerUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: banner,
        message: "Banner created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateBannerSchema.parse(req.body);
      const banner = await this.updateBannerUseCase.execute(id, validated);
      res.json({
        success: true,
        data: banner,
        message: "Banner updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteBannerUseCase.execute(id);
      res.json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
