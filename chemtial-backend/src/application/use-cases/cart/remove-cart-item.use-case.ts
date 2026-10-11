import { CartRepository } from "../../../domain/repositories/cart.repository";
import { Cart } from "../../../domain/entities/cart.entity";

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string, cartItemId: string): Promise<Cart> {
    return this.cartRepository.removeItem(userId, cartItemId);
  }
}
