import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { Cart } from "../../../domain/entities/cart.entity.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundError("Cart", userId);
    }
    return cart;
  }
}
