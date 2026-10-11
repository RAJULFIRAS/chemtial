import { CartRepository } from "../../../domain/repositories/cart.repository";
import { Cart } from "../../../domain/entities/cart.entity";
import { NotFoundError } from "../../../shared/exceptions/app.error";

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
