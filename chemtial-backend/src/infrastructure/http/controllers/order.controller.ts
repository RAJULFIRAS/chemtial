import { Request, Response, NextFunction } from "express";
import { CreateOrderUseCase } from "../../../application/use-cases/order/create-order.use-case";
import { GetOrdersUseCase } from "../../../application/use-cases/order/get-orders.use-case";
import { GetOrderByIdUseCase } from "../../../application/use-cases/order/get-order-by-id.use-case";
import { GetAllOrdersUseCase } from "../../../application/use-cases/order/get-all-orders.use-case";
import { GetRevenueReportUseCase } from "../../../application/use-cases/order/get-revenue-report.use-case";
import { UpdateOrderStatusUseCase } from "../../../application/use-cases/order/update-order-status.use-case";
import { GetCodPendingUseCase } from "../../../application/use-cases/order/get-cod-pending.use-case";
import { CancelMyOrderUseCase } from "../../../application/use-cases/order/cancel-my-order.use-case";
import { RevenueRange } from "../../../application/use-cases/order/get-revenue-report.use-case";
import { ConfirmCodReceivedUseCase } from "../../../application/use-cases/order/confirm-cod-received.use-case";
import { GetOrderHistoryUseCase } from "../../../application/use-cases/order/get-order-history.use-case";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../../../application/dtos/order.dto";
import { ForbiddenError } from "../../../shared/exceptions/app.error";

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly getRevenueReportUseCase: GetRevenueReportUseCase,
    private readonly getOrderHistoryUseCase: GetOrderHistoryUseCase,
    private readonly getCodPendingUseCase: GetCodPendingUseCase,
    private readonly confirmCodReceivedUseCase: ConfirmCodReceivedUseCase,
    private readonly cancelMyOrderUseCase: CancelMyOrderUseCase,
  ) {}

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const validated = createOrderSchema.parse(req.body);
      const order = await this.createOrderUseCase.execute(userId, validated);
      res.status(201).json({
        success: true,
        data: order,
        message: "Order created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const orders = await this.getOrdersUseCase.execute(userId);
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelMyOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const order = await this.cancelMyOrderUseCase.execute({
        orderId: id,
        userId,
        reason,
        ipAddress: req.ip,
        userAgent: req.get("user-agent") ?? undefined,
      });

      res.json({
        success: true,
        data: order,
        message: "Pesanan berhasil dibatalkan",
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.getOrderByIdUseCase.execute(id);

      const userRole = req.user?.role;
      const isAdminPanelRole =
        userRole === "manager" ||
        userRole === "admin" ||
        userRole === "courier";

      if (!isAdminPanelRole && order.userId !== req.user?.id) {
        throw new ForbiddenError("Access denied to this order");
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderHistory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.getOrderByIdUseCase.execute(id);

      const userRole = req.user?.role;
      const isAdminPanelRole =
        userRole === "manager" ||
        userRole === "admin" ||
        userRole === "courier";

      if (!isAdminPanelRole && order.userId !== req.user?.id) {
        throw new ForbiddenError("Access denied to this order");
      }

      const history = await this.getOrderHistoryUseCase.execute(id);
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.getAllOrdersUseCase.execute({
        page,
        limit,
        status,
        search,
      });
      res.json({
        success: true,
        data: result.data,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const range = (req.query.range as RevenueRange) || "12months";
      const report = await this.getRevenueReportUseCase.execute(range);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getCodPending(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const orders = await this.getCodPendingUseCase.execute();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmCod(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId || !userRole) {
        throw new ForbiddenError("Authentication required");
      }

      const order = await this.confirmCodReceivedUseCase.execute(
        id,
        userId,
        userRole,
        req.ip,
        req.get("user-agent") ?? undefined,
      );

      res.json({
        success: true,
        data: order,
        message: "COD payment confirmed. Order marked as delivered.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const all = await this.getAllOrdersUseCase.execute({
        page: 1,
        limit: 10000,
      });
      const orders = all.data;
      const pending = orders.filter((o) =>
        ["pending", "paid", "processing"].includes(o.status),
      ).length;
      const shipped = orders.filter((o) => o.status === "shipped").length;
      const delivered = orders.filter((o) => o.status === "delivered").length;
      const cancelled = orders.filter((o) => o.status === "cancelled").length;

      res.json({
        success: true,
        data: {
          total: orders.length,
          pending,
          shipped,
          delivered,
          cancelled,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const validated = updateOrderStatusSchema.parse(req.body);

      const order = await this.updateOrderStatusUseCase.execute(
        id,
        validated.status,
        {
          userId: req.user?.id ?? "system",
          ipAddress: req.ip,
          userAgent: req.get("user-agent") ?? undefined,
          note: validated.note,
        },
      );

      res.json({
        success: true,
        data: order,
        message: "Order status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
