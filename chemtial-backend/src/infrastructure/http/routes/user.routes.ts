import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, managerOnly } from "../middlewares/auth.middleware";
import { JwtService } from "../../auth/jwt.service";

export const createUserRoutes = (
  controller: UserController,
  jwtService: JwtService,
): Router => {
  const router = Router();

  router.use(authMiddleware(jwtService));

  router.get(
    "/",
    (req, res, next) => {
      const role = req.user?.role;
      if (role !== "manager" && role !== "admin") {
        res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied. Required role: manager or admin",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next();
    },
    (req, res, next) => controller.getAll(req, res, next),
  );

  router.patch("/:id/role", managerOnly, (req, res, next) =>
    controller.updateRole(req, res, next),
  );

  router.delete(
    "/:id",
    (req, res, next) => {
      const role = req.user?.role;
      if (role !== "manager" && role !== "admin") {
        res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Access denied. Required role: manager or admin",
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      next();
    },
    (req, res, next) => controller.delete(req, res, next),
  );

  return router;
};
