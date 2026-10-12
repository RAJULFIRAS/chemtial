process.env.NODE_ENV = "test";
process.env.PORT = "3100";

process.env.JWT_SECRET = "test-jwt-secret-min-32-characters-long-abcdef";
process.env.REFRESH_SECRET = "test-refresh-secret-min-32-characters-long-xyz";
process.env.JWT_EXPIRY = "1h";
process.env.REFRESH_EXPIRY = "7d";

process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:1976/chemtial_test";

process.env.CORS_ORIGIN = "http://localhost:5000";

process.env.LOG_LEVEL = "error";

process.env.BASE_URL = "http://localhost:3000";
process.env.UPLOAD_DIR = "./uploads";
process.env.MAX_FILE_SIZE = "5242880";
process.env.ALLOWED_MIME_TYPES = "image/jpeg,image/png,image/webp,image/gif";

process.env.RATE_LIMIT_WINDOW = "900000";
process.env.RATE_LIMIT_MAX = "10000";
process.env.AUTH_RATE_LIMIT_WINDOW = "900000";
process.env.AUTH_RATE_LIMIT_MAX = "10000";
process.env.WRITE_RATE_LIMIT_WINDOW = "900000";
process.env.WRITE_RATE_LIMIT_MAX = "10000";
process.env.CHECKOUT_RATE_LIMIT_WINDOW = "300000";
process.env.CHECKOUT_RATE_LIMIT_MAX = "10000";
process.env.SEARCH_RATE_LIMIT_WINDOW = "60000";
process.env.SEARCH_RATE_LIMIT_MAX = "10000";
process.env.VOUCHER_CLAIM_RATE_LIMIT_WINDOW = "3600000";
process.env.VOUCHER_CLAIM_RATE_LIMIT_MAX = "10000";
process.env.UPLOAD_RATE_LIMIT_WINDOW = "900000";
process.env.UPLOAD_RATE_LIMIT_MAX = "10000";

process.env.STRIPE_SECRET_KEY = "";
process.env.STRIPE_PUBLISHABLE_KEY = "";
process.env.STRIPE_WEBHOOK_SECRET = "";

process.env.DEFAULT_SHIPPING_COST = "3.00";
process.env.DEFAULT_CURRENCY = "USD";
process.env.MIN_PURCHASE_FOR_FREE_SHIPPING = "50.00";

process.env.SUPPORT_PHONE = "+1 (617) 555-0199";
process.env.WHATSAPP = "+1 (617) 555-0199";
process.env.SUPPORT_EMAIL = "inbox@chemtial.com";
process.env.CAREER_EMAIL = "career@chemtial.com";
process.env.B2B_EMAIL = "b2b@chemtial.com";
process.env.COMPANY_ADDRESS = "D St, Boston, MA 02210, United States";
process.env.LEGAL_NAME = "Chemtial LLC";
process.env.TIMEZONE = "EST";

process.env.BANK_NAME = "Bank of America";
process.env.BANK_ACCOUNT_NAME = "Chemtial LLC";
process.env.BANK_ACCOUNT_NUMBER = "1234567890";
process.env.BANK_ROUTING_NUMBER = "026009593";

import { afterAll, vi } from "vitest";

afterAll(async () => {
  vi.clearAllMocks();
});
