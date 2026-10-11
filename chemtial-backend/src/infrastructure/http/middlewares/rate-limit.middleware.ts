import rateLimit from "express-rate-limit";
import { config } from "../../../config/env.validation";
import { Request } from "express";

const userKeyGenerator = (req: Request): string => {
  const userId = req.user?.id;
  if (userId) return `user:${userId}`;
  return `ip:${req.ip || "unknown"}`;
};

export const generalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests, please try again later.",
      retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
  skip: (req) => {
    return req.path === "/health";
  },
});

export const authLimiter = rateLimit({
  windowMs: config.AUTH_RATE_LIMIT_WINDOW,
  max: config.AUTH_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many authentication attempts, please try again later.",
      retryAfter: Math.ceil(config.AUTH_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return `auth:${req.ip || "unknown"}`;
  },
});

export const writeLimiter = rateLimit({
  windowMs: config.WRITE_RATE_LIMIT_WINDOW,
  max: config.WRITE_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many write operations, please try again later.",
      retryAfter: Math.ceil(config.WRITE_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
});

export const checkoutLimiter = rateLimit({
  windowMs: config.CHECKOUT_RATE_LIMIT_WINDOW,
  max: config.CHECKOUT_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many checkout attempts, please try again later.",
      retryAfter: Math.ceil(config.CHECKOUT_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
});

export const searchLimiter = rateLimit({
  windowMs: config.SEARCH_RATE_LIMIT_WINDOW,
  max: config.SEARCH_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many search requests, please slow down.",
      retryAfter: Math.ceil(config.SEARCH_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
});

export const voucherClaimLimiter = rateLimit({
  windowMs: config.VOUCHER_CLAIM_RATE_LIMIT_WINDOW,
  max: config.VOUCHER_CLAIM_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many voucher claims, please try again later.",
      retryAfter: Math.ceil(config.VOUCHER_CLAIM_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
});

export const uploadLimiter = rateLimit({
  windowMs: config.UPLOAD_RATE_LIMIT_WINDOW,
  max: config.UPLOAD_RATE_LIMIT_MAX,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many uploads, please try again later.",
      retryAfter: Math.ceil(config.UPLOAD_RATE_LIMIT_WINDOW / 1000),
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: userKeyGenerator,
});

export const trackDownloadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many tracking requests, please try again later.",
      retryAfter: 60,
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
