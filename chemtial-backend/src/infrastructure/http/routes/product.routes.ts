import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import { JwtService } from "../../../infrastructure/auth/jwt.service.js";
import { searchLimiter } from "../middlewares/rate-limit.middleware.js";

export const createProductRoutes = (
  controller: ProductController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.get("/", searchLimiter, (req, res, next) =>
    controller.getProducts(req, res, next),
  );
  router.get("/:id", (req, res, next) =>
    controller.getProductById(req, res, next),
  );

  router.post(
    "/",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.createProduct(req, res, next),
  );

  router.put(
    "/:id",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.updateProduct(req, res, next),
  );

  router.delete(
    "/:id",
    authMiddleware(jwtService),
    adminMiddleware,
    (req, res, next) => controller.deleteProduct(req, res, next),
  );

  return router;
};
