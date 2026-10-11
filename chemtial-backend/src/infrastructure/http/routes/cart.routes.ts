import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createCartRoutes = (
  controller: CartController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.use(authMiddleware(jwtService));

  router.get("/", (req, res, next) => controller.getCart(req, res, next));
  router.post("/items", (req, res, next) => controller.addItem(req, res, next));
  router.patch("/items/:id", (req, res, next) =>
    controller.updateItem(req, res, next),
  );
  router.delete("/items/:id", (req, res, next) =>
    controller.removeItem(req, res, next),
  );

  return router;
};
