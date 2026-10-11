import { Request, Response, NextFunction } from "express";
import { GetCartUseCase } from "../../../application/use-cases/cart/get-cart.use-case";
import { AddToCartUseCase } from "../../../application/use-cases/cart/add-to-cart.use-case";
import { UpdateCartItemUseCase } from "../../../application/use-cases/cart/update-cart-item.use-case";
import { RemoveCartItemUseCase } from "../../../application/use-cases/cart/remove-cart-item.use-case";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../../../application/dtos/cart.dto";

export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly updateCartItemUseCase: UpdateCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  async getCart(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const cart = await this.getCartUseCase.execute(userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async addItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const validated = addToCartSchema.parse(req.body);
      const cart = await this.addToCartUseCase.execute(userId, validated);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const { id } = req.params;
      const validated = updateCartItemSchema.parse(req.body);
      const cart = await this.updateCartItemUseCase.execute(
        userId,
        id,
        validated.quantity,
      );
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const { id } = req.params;
      const cart = await this.removeCartItemUseCase.execute(userId, id);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }
}
