import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRY: z.string().default("7d"),
  REFRESH_SECRET: z
    .string()
    .min(32, "REFRESH_SECRET must be at least 32 characters"),
  REFRESH_EXPIRY: z.string().default("30d"),

  CORS_ORIGIN: z.string().default("http://localhost:5000"),

  RATE_LIMIT_WINDOW: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX: z.string().transform(Number).default("500"),

  AUTH_RATE_LIMIT_WINDOW: z.string().transform(Number).default("900000"),
  AUTH_RATE_LIMIT_MAX: z.string().transform(Number).default("10"),

  WRITE_RATE_LIMIT_WINDOW: z.string().transform(Number).default("900000"),
  WRITE_RATE_LIMIT_MAX: z.string().transform(Number).default("100"),

  CHECKOUT_RATE_LIMIT_WINDOW: z.string().transform(Number).default("300000"),
  CHECKOUT_RATE_LIMIT_MAX: z.string().transform(Number).default("20"),

  SEARCH_RATE_LIMIT_WINDOW: z.string().transform(Number).default("60000"),
  SEARCH_RATE_LIMIT_MAX: z.string().transform(Number).default("60"),

  VOUCHER_CLAIM_RATE_LIMIT_WINDOW: z
    .string()
    .transform(Number)
    .default("3600000"),
  VOUCHER_CLAIM_RATE_LIMIT_MAX: z.string().transform(Number).default("20"),

  UPLOAD_RATE_LIMIT_WINDOW: z.string().transform(Number).default("900000"),
  UPLOAD_RATE_LIMIT_MAX: z.string().transform(Number).default("50"),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.string().transform(Number).default("5242880"),
  ALLOWED_MIME_TYPES: z
    .string()
    .default("image/jpeg,image/png,image/webp,image/gif"),
  BASE_URL: z.string().url().default("http://localhost:3000"),

  DEFAULT_SHIPPING_COST: z.string().transform(Number).default("3.00"),
  DEFAULT_CURRENCY: z.string().default("USD"),
  MIN_PURCHASE_FOR_FREE_SHIPPING: z.string().transform(Number).default("50.00"),

  SUPPORT_PHONE: z.string().default("+62 852-7717-3823"),
  WHATSAPP: z.string().default("+62 852-7717-3823"),
  SUPPORT_EMAIL: z.string().email().default("inbox@chemtial.com"),
  CAREER_EMAIL: z.string().email().default("career@chemtial.com"),
  B2B_EMAIL: z.string().email().default("b2b@chemtial.com"),
  COMPANY_ADDRESS: z.string().default("D St, Boston, MA 02210, United States"),
  LEGAL_NAME: z.string().default("Chemtial LLC"),
  TIMEZONE: z.string().default("EST"),

  BANK_NAME: z.string().default("Bank of America"),
  BANK_ACCOUNT_NAME: z.string().default("Chemtial LLC"),
  BANK_ACCOUNT_NUMBER: z.string().default("1234567890"),
  BANK_ROUTING_NUMBER: z.string().default("026009593"),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

let _config: EnvConfig | null = null;

export const validateEnv = (): EnvConfig => {
  if (_config) return _config;

  try {
    _config = envSchema.parse(process.env);
    return _config;
  } catch (error) {
    console.error("Invalid environment variables:", error);
    process.exit(1);
  }
};

export const config: EnvConfig = new Proxy({} as EnvConfig, {
  get(_target, prop: string) {
    return validateEnv()[prop as keyof EnvConfig];
  },
});
