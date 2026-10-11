import { Router } from "express";
import { BannerController } from "../controllers/banner.controller";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createBannerRoutes = (
  controller: BannerController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.get("/", (req, res, next) => controller.getAll(req, res, next));
  router.get("/:id", (req, res, next) => controller.getById(req, res, next));

  router.post(
    "/",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.create(req, res, next),
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
