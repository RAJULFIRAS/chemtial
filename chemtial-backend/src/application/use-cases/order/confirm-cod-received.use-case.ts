import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { UpdateOrderStatusUseCase } from "./update-order-status.use-case.js";
import { Order } from "../../../domain/entities/order.entity.js";
import {
  NotFoundError,
  ValidationError,
} from "../../../shared/exceptions/app.error.js";

export class ConfirmCodReceivedUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  async execute(
    orderId: string,
    actorId: string,
    actorRole: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order", orderId);
    }

    if (order.paymentMethod !== "cod") {
      throw new ValidationError(
        "Only COD orders can be confirmed via this endpoint",
      );
    }

    const validStatuses = ["shipped", "awaiting_payment"];
    if (!validStatuses.includes(order.status)) {
      throw new ValidationError(
        `Order must be in 'shipped' status to confirm. Current: ${order.status}`,
      );
    }

    return await this.updateOrderStatusUseCase.execute(orderId, "delivered", {
      userId: actorId,
      ipAddress,
      userAgent,
      note: `COD payment received and confirmed by ${actorRole}`,
    });
  }
}
