import { Request, Response, NextFunction } from "express";
import { GetCategoriesUseCase } from "../../../application/use-cases/category/get-categories.use-case.js";
import { GetCategoryByIdUseCase } from "../../../application/use-cases/category/get-category-by-id.use-case.js";
import { GetCategoryBySlugUseCase } from "../../../application/use-cases/category/get-category-by-slug.use-case.js";
import { CreateCategoryUseCase } from "../../../application/use-cases/category/create-category.use-case.js";
import { UpdateCategoryUseCase } from "../../../application/use-cases/category/update-category.use-case.js";
import { DeleteCategoryUseCase } from "../../../application/use-cases/category/delete-category.use-case.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../../application/dtos/category.dto.js";

export class CategoryController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getCategoryBySlugUseCase: GetCategoryBySlugUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search } = req.query;
      const categories = await this.getCategoriesUseCase.execute({
        search: search as string,
      });
      res.json({ success: true, data: categories });
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
      const category = await this.getCategoryByIdUseCase.execute(id);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { slug } = req.params;
      const category = await this.getCategoryBySlugUseCase.execute(slug);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createCategorySchema.parse(req.body);
      const category = await this.createCategoryUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: category,
        message: "Category created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateCategorySchema.parse(req.body);
      const category = await this.updateCategoryUseCase.execute(id, validated);
      res.json({
        success: true,
        data: category,
        message: "Category updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteCategoryUseCase.execute(id);
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
