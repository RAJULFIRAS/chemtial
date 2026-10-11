export interface OrderStatusHistoryEntry {
  id: string;
  orderId: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: Date;
}

export interface OrderStatusHistoryRepository {
  create(data: {
    orderId: string;
    status: string;
    note?: string | null;
    changedBy?: string | null;
  }): Promise<OrderStatusHistoryEntry>;

  findByOrderId(orderId: string): Promise<OrderStatusHistoryEntry[]>;
}
