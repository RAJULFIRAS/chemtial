import { OrderRepository } from "../../../domain/repositories/order.repository";
import { Order } from "../../../domain/entities/order.entity";

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
