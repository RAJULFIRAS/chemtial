import { prisma } from "../prisma/client.js";
import {
  OrderStatusHistoryEntry,
  OrderStatusHistoryRepository,
} from "../../../domain/repositories/order-status-history.repository.js";

export class PrismaOrderStatusHistoryRepository implements OrderStatusHistoryRepository {
  async create(data: {
    orderId: string;
    status: string;
    note?: string | null;
    changedBy?: string | null;
  }): Promise<OrderStatusHistoryEntry> {
    const entry = await prisma.orderStatusHistory.create({
      data: {
        orderId: data.orderId,
        status: data.status,
        note: data.note ?? null,
        changedBy: data.changedBy ?? null,
      },
    });

    return {
      id: entry.id,
      orderId: entry.orderId,
      status: entry.status,
      note: entry.note,
      changedBy: entry.changedBy,
      createdAt: entry.createdAt,
    };
  }

  async findByOrderId(orderId: string): Promise<OrderStatusHistoryEntry[]> {
    const entries = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    return entries.map((e) => ({
      id: e.id,
      orderId: e.orderId,
      status: e.status,
      note: e.note,
      changedBy: e.changedBy,
      createdAt: e.createdAt,
    }));
  }
}
