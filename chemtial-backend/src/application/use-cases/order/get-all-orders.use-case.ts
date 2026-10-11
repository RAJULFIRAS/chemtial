import { OrderRepository } from "../../../domain/repositories/order.repository";

export class GetAllOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }) {
    const result = await this.orderRepository.findAllAdmin(params);
    return {
      data: result.data,
      total: result.total,
    };
  }
}
