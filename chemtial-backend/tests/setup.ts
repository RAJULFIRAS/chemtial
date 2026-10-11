import { beforeAll, afterAll, vi } from "vitest";

beforeAll(() => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-jwt-secret-min-32-characters-long-abcdef";
  process.env.REFRESH_SECRET = "test-refresh-secret-min-32-characters-long-xyz";
  process.env.JWT_EXPIRY = "1h";
  process.env.REFRESH_EXPIRY = "7d";
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:1976/chemtial_test";
  process.env.CORS_ORIGIN = "http://localhost:5000";
  process.env.LOG_LEVEL = "error";
  process.env.UPLOAD_DIR = "./uploads";
  process.env.BASE_URL = "http://localhost:3000";
  process.env.DEFAULT_SHIPPING_COST = "3.00";
  process.env.DEFAULT_CURRENCY = "USD";
});

afterAll(() => {
  vi.clearAllMocks();
});
