import { Order } from "../entities/order.entity";
import { CreateOrderDTO } from "../../application/dtos/order.dto";
import {
  RevenueReport,
  RevenueRange,
} from "../../application/use-cases/order/get-revenue-report.use-case";

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(
    userId: string,
    data: CreateOrderDTO,
    orderNumber: string,
  ): Promise<Order>;
  updateStatus(id: string, status: string): Promise<Order>;
  findAll(params: {
    page: number;
    limit: number;
    userId?: string;
    status?: string;
  }): Promise<{ data: Order[]; total: number }>;
  findAllAdmin(params: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  }): Promise<{ data: Order[]; total: number }>;
  getRevenueReport(range: RevenueRange): Promise<RevenueReport>;
  updateTotals(
    id: string,
    totals: {
      subtotal: number;
      productDiscount: number;
      voucherDiscount: number;
      shippingCost: number;
      totalAmount: number;
    },
  ): Promise<void>;
}
