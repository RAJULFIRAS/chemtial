import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../../../shared/exceptions/app.error.js";
import { logger } from "../../../shared/utils/logger.js";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    const errors = err.errors.reduce<Record<string, string[]>>((acc, e) => {
      const field = e.path.join(".");
      if (!acc[field]) acc[field] = [];
      acc[field].push(e.message);
      return acc;
    }, {});

    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: errors,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
    timestamp: new Date().toISOString(),
  });
};
