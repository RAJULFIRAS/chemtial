import { CartRepository } from "../../../domain/repositories/cart.repository.js";
import { AddToCartDTO } from "../../dtos/cart.dto.js";
import { Cart } from "../../../domain/entities/cart.entity.js";

export class AddToCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string, item: AddToCartDTO): Promise<Cart> {
    return this.cartRepository.addItem(userId, item);
  }
}
