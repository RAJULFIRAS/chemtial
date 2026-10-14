import { Router } from "express";
import rateLimit from "express-rate-limit";
import { DownloadController } from "../controllers/download.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import { JwtService } from "../../auth/jwt.service.js";

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many tracking requests, please try again later.",
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createDownloadRoutes = (
  controller: DownloadController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.post("/track", trackLimiter, (req, res, next) =>
    controller.track(req, res, next),
  );

  router.get(
    "/stats",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.getStats(req, res, next),
  );

  router.get(
    "/analytics",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.getAnalytics(req, res, next),
  );

  return router;
};
