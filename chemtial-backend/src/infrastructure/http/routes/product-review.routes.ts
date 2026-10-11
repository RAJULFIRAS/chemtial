import { Router } from "express";
import { ProductReviewController } from "../controllers/product-review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createProductReviewRoutes = (
  controller: ProductReviewController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.get("/my-reviews", authMiddleware(jwtService), (req, res, next) =>
    controller.getMyReviews(req, res, next),
  );

  router.get("/product/:id", (req, res, next) =>
    controller.getByProduct(req, res, next),
  );

  router.post("/", authMiddleware(jwtService), (req, res, next) =>
    controller.create(req, res, next),
  );

  return router;
};
