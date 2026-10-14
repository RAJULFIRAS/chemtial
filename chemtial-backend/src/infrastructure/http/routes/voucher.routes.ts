import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import { JwtService } from "../../auth/jwt.service.js";
import { voucherClaimLimiter } from "../middlewares/rate-limit.middleware.js";

export const createVoucherRoutes = (
  controller: VoucherController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.get("/my-vouchers", authMiddleware(jwtService), (req, res, next) =>
    controller.getMyVouchers(req, res, next),
  );
  router.post("/validate", authMiddleware(jwtService), (req, res, next) =>
    controller.validate(req, res, next),
  );

  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.post(
    "/",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.create(req, res, next),
  );

  router.get("/:id", (req, res, next) => controller.getById(req, res, next));
  router.post(
    "/:id/claim",
    voucherClaimLimiter,
    authMiddleware(jwtService),
    (req, res, next) => controller.claim(req, res, next),
  );
  router.put(
    "/:id",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.update(req, res, next),
  );
  router.delete(
    "/:id",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.delete(req, res, next),
  );

  return router;
};
