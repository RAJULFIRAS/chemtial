import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";

export const createAuthRoutes = (controller: AuthController): Router => {
  const router = Router();

  router.post("/register", authLimiter, (req, res, next) =>
    controller.register(req, res, next),
  );
  router.post("/login", authLimiter, (req, res, next) =>
    controller.login(req, res, next),
  );
  router.post("/refresh", (req, res, next) =>
    controller.refreshToken(req, res, next),
  );
  router.post("/forgot-password", authLimiter, (req, res, next) =>
    controller.forgotPassword(req, res, next),
  );
  router.post("/reset-password", (req, res, next) =>
    controller.resetPassword(req, res, next),
  );

  return router;
};
