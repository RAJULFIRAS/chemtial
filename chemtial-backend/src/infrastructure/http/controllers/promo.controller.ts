import { Request, Response, NextFunction } from "express";
import { GetPromosUseCase } from "../../../application/use-cases/promo/get-promos.use-case";
import { GetPromoByIdUseCase } from "../../../application/use-cases/promo/get-promo-by-id.use-case";
import { CreatePromoUseCase } from "../../../application/use-cases/promo/create-promo.use-case";
import { UpdatePromoUseCase } from "../../../application/use-cases/promo/update-promo.use-case";
import { DeletePromoUseCase } from "../../../application/use-cases/promo/delete-promo.use-case";
import {
  createPromoSchema,
  updatePromoSchema,
} from "../../../application/dtos/promo.dto";

export class PromoController {
  constructor(
    private readonly getPromosUseCase: GetPromosUseCase,
    private readonly getPromoByIdUseCase: GetPromoByIdUseCase,
    private readonly createPromoUseCase: CreatePromoUseCase,
    private readonly updatePromoUseCase: UpdatePromoUseCase,
    private readonly deletePromoUseCase: DeletePromoUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isActive, search, activeNow } = req.query;
      const promos = await this.getPromosUseCase.execute({
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
        search: search as string,
        onlyActiveNow: activeNow === "true",
      });
      res.json({ success: true, data: promos });
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
      const promo = await this.getPromoByIdUseCase.execute(id);
      res.json({ success: true, data: promo });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createPromoSchema.parse(req.body);
      const promo = await this.createPromoUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: promo,
        message: "Promo created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updatePromoSchema.parse(req.body);
      const promo = await this.updatePromoUseCase.execute(id, validated);
      res.json({
        success: true,
        data: promo,
        message: "Promo updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deletePromoUseCase.execute(id);
      res.json({ success: true, message: "Promo deleted successfully" });
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
      const all = await this.getPromosUseCase.execute({});
      const now = new Date();
      const active = all.filter(
        (p) =>
          p.isActive &&
          new Date(p.startDate) <= now &&
          new Date(p.endDate) >= now,
      );
      res.json({
        success: true,
        data: {
          total: all.length,
          active: active.length,
          inactive: all.length - active.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
