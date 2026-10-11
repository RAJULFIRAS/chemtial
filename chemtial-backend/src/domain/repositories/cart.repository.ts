import { Cart } from "../entities/cart.entity";
import { AddToCartDTO } from "../../application/dtos/cart.dto";

export interface CartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  addItem(userId: string, item: AddToCartDTO): Promise<Cart>;
  updateItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart>;
  removeItem(userId: string, cartItemId: string): Promise<Cart>;
  clear(userId: string): Promise<void>;
}
