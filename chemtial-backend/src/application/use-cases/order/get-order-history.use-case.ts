import { OrderRepository } from "../../../domain/repositories/order.repository";
import { OrderStatusHistoryRepository } from "../../../domain/repositories/order-status-history.repository";
import { NotFoundError } from "../../../shared/exceptions/app.error";

export interface OrderHistoryEntryResponse {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: Date;
}

export interface OrderHistoryResponse {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  history: OrderHistoryEntryResponse[];
}

export class GetOrderHistoryUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly historyRepository: OrderStatusHistoryRepository,
  ) {}

  async execute(orderId: string): Promise<OrderHistoryResponse> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order", orderId);
    }

    const history = await this.historyRepository.findByOrderId(orderId);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      history: history.map((h) => ({
        id: h.id,
        status: h.status,
        note: h.note,
        changedBy: h.changedBy,
        createdAt: h.createdAt,
      })),
    };
  }
}
