import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createPaymentRoutes = (
  controller: PaymentController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.post("/webhook/stripe", (req, res, next) =>
    controller.handleWebhook(req, res, next),
  );

  router.post(
    "/create-payment-intent",
    authMiddleware(jwtService),
    (req, res, next) => controller.createPaymentIntent(req, res, next),
  );

  router.post(
    "/create-checkout-session",
    authMiddleware(jwtService),
    (req, res, next) => controller.createCheckoutSession(req, res, next),
  );

  return router;
};
