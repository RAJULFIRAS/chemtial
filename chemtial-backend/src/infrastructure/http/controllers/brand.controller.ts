import { Request, Response, NextFunction } from "express";
import { GetBrandsUseCase } from "../../../application/use-cases/brand/get-brands.use-case";
import { GetBrandByIdUseCase } from "../../../application/use-cases/brand/get-brand-by-id.use-case";
import { CreateBrandUseCase } from "../../../application/use-cases/brand/create-brand.use-case";
import { UpdateBrandUseCase } from "../../../application/use-cases/brand/update-brand.use-case";
import { DeleteBrandUseCase } from "../../../application/use-cases/brand/delete-brand.use-case";
import {
  createBrandSchema,
  updateBrandSchema,
} from "../../../application/dtos/brand.dto";

export class BrandController {
  constructor(
    private readonly getBrandsUseCase: GetBrandsUseCase,
    private readonly getBrandByIdUseCase: GetBrandByIdUseCase,
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search } = req.query;
      const brands = await this.getBrandsUseCase.execute({
        search: search as string,
      });
      res.json({ success: true, data: brands });
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
      const brand = await this.getBrandByIdUseCase.execute(id);
      res.json({ success: true, data: brand });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createBrandSchema.parse(req.body);
      const brand = await this.createBrandUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: brand,
        message: "Brand created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateBrandSchema.parse(req.body);
      const brand = await this.updateBrandUseCase.execute(id, validated);
      res.json({
        success: true,
        data: brand,
        message: "Brand updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteBrandUseCase.execute(id);
      res.json({ success: true, message: "Brand deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
