import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../auth/jwt.service.js";
import { PrismaUserRepository } from "../../database/repositories/prisma-user.repository.js";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../../shared/exceptions/app.error.js";

const userRepository = new PrismaUserRepository();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (jwtService: JwtService) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        throw new UnauthorizedError("Authentication required");
      }

      const token = authHeader.substring(7);
      req.user = jwtService.verifyAccessToken(token);

      userRepository.updateLastSeen(req.user.id).catch(() => {});

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const roleMiddleware = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required role: ${roles.join(" or ")}`,
      );
    }
    next();
  };
};

export const managerOnly = roleMiddleware("manager");
export const adminMiddleware = roleMiddleware("manager", "admin");
export const courierMiddleware = roleMiddleware("manager", "admin", "courier");
export const anyAdminPanelRole = roleMiddleware("manager", "admin", "courier");
export const anyAuthenticatedRole = roleMiddleware(
  "manager",
  "admin",
  "courier",
  "user",
);
