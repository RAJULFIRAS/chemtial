import { CartRepository } from "../../../domain/repositories/cart.repository";
import { AddToCartDTO } from "../../dtos/cart.dto";
import { Cart } from "../../../domain/entities/cart.entity";

export class AddToCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string, item: AddToCartDTO): Promise<Cart> {
    return this.cartRepository.addItem(userId, item);
  }
}
