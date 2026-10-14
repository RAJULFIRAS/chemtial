import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { Cart } from "../../../domain/entities/cart.entity.js";

export class UpdateCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    return this.cartRepository.updateItemQuantity(userId, cartItemId, quantity);
  }
}
