import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import {
  authMiddleware,
  adminMiddleware,
  managerOnly,
  courierMiddleware,
} from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";
import {
  checkoutLimiter,
  writeLimiter,
} from "../middlewares/rate-limit.middleware";

export const createOrderRoutes = (
  controller: OrderController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.use(authMiddleware(jwtService));

  router.post("/", checkoutLimiter, (req, res, next) =>
    controller.createOrder(req, res, next),
  );
  router.get("/", (req, res, next) => controller.getOrders(req, res, next));

  router.get("/cod/pending", courierMiddleware, (req, res, next) =>
    controller.getCodPending(req, res, next),
  );
  router.patch("/cod/:id/confirm", courierMiddleware, (req, res, next) =>
    controller.confirmCod(req, res, next),
  );
  router.get("/admin/stats", adminMiddleware, (req, res, next) =>
    controller.getStats(req, res, next),
  );
  router.get("/admin/revenue", managerOnly, (req, res, next) =>
    controller.getRevenueReport(req, res, next),
  );
  router.get("/admin/all", adminMiddleware, (req, res, next) =>
    controller.getAllAdmin(req, res, next),
  );
  router.get("/:id", (req, res, next) =>
    controller.getOrderById(req, res, next),
  );
  router.get("/:id/history", (req, res, next) =>
    controller.getOrderHistory(req, res, next),
  );
  router.patch("/:id/status", adminMiddleware, (req, res, next) =>
    controller.updateStatus(req, res, next),
  );
  router.patch("/:id/cancel", writeLimiter, (req, res, next) =>
    controller.cancelMyOrder(req, res, next),
  );

  return router;
};
