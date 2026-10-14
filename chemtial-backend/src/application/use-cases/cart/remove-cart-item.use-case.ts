import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { Cart } from "../../../domain/entities/cart.entity.js";

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string, cartItemId: string): Promise<Cart> {
    return this.cartRepository.removeItem(userId, cartItemId);
  }
}
