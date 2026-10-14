import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { Order } from "../../../domain/entities/order.entity.js";

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
