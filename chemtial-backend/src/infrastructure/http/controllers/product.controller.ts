import { Request, Response, NextFunction } from "express";
import { GetProductsUseCase } from "../../../application/use-cases/product/get-products.use-case";
import { GetProductByIdUseCase } from "../../../application/use-cases/product/get-product-by-id.use-case";
import { CreateProductUseCase } from "../../../application/use-cases/product/create-product.use-case";
import { productQuerySchema } from "../../../application/dtos/product.dto";
import { CreateProductDTO } from "../../../application/dtos/product.dto";
import { UpdateProductUseCase } from "../../../application/use-cases/product/update-product.use-case";
import { DeleteProductUseCase } from "../../../application/use-cases/product/delete-product.use-case";

export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = productQuerySchema.parse(req.query);
      const result = await this.getProductsUseCase.execute(query);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          page: query.page,
          limit: query.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / query.limit),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.updateProductUseCase.execute(id, req.body);
      res
        .status(200)
        .json({ success: true, data: result, message: "Product updated" });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteProductUseCase.execute(id);
      res.json({ success: true, message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.getProductByIdUseCase.execute(id);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validated = req.body as CreateProductDTO;
      const result = await this.createProductUseCase.execute(validated);
      res.status(201).json({
        success: true,
        data: result,
        message: "Product created successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
