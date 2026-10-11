import { OrderRepository } from "../../../domain/repositories/order.repository";

export type RevenueRange =
  | "day"
  | "week"
  | "month"
  | "3months"
  | "6months"
  | "12months";

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueReport {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    pendingRevenue: number;
    paidRevenue: number;
    completedRevenue: number;
  };
  monthly: MonthlyRevenue[];
  byStatus: Record<string, { count: number; totalAmount: number }>;
  range: RevenueRange;
}

export class GetRevenueReportUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(range: RevenueRange = "12months"): Promise<RevenueReport> {
    return this.orderRepository.getRevenueReport(range);
  }
}
