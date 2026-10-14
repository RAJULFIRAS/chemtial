import { Request, Response, NextFunction } from "express";
import { CreateProductReviewUseCase } from "../../../application/use-cases/product/create-product-review.use-case.js";
import { GetProductReviewsUseCase } from "../../../application/use-cases/product/get-product-reviews.use-case.js";
import { createProductReviewSchema } from "../../../application/dtos/product-review.dto.js";
import { UnauthorizedError } from "../../../shared/exceptions/app.error.js";
import { GetMyReviewsUseCase } from "../../../application/use-cases/product/get-my-reviews.use-case.js";

export class ProductReviewController {
  constructor(
    private readonly createProductReviewUseCase: CreateProductReviewUseCase,
    private readonly getProductReviewsUseCase: GetProductReviewsUseCase,
    private readonly getMyReviewsUseCase: GetMyReviewsUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError("Authentication required");
      const validated = createProductReviewSchema.parse(req.body);
      const review = await this.createProductReviewUseCase.execute(
        userId,
        validated,
      );
      res.status(201).json({
        success: true,
        data: review,
        message: "Ulasan berhasil dikirim",
      });
    } catch (error) {
      next(error);
    }
  }

  async getByProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getProductReviewsUseCase.execute(id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMyReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError("Authentication required");

      const { orderItemIds } = req.query;
      if (!orderItemIds || typeof orderItemIds !== "string") {
        res.json({ success: true, data: [] });
        return;
      }

      const ids = orderItemIds.split(",").filter(Boolean);
      const reviews = await this.getMyReviewsUseCase.execute(userId, ids);
      res.json({ success: true, data: reviews });
    } catch (error) {
      next(error);
    }
  }
}
