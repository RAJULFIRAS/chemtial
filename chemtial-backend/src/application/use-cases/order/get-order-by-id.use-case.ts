import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { Order } from "../../../domain/entities/order.entity.js";
import { NotFoundError } from "../../../shared/exceptions/app.error.js";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order", orderId);
    }
    return order;
  }
}
