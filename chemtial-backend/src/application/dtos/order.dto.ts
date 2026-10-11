import { z } from "zod";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

export const shippingAddressSchema = z.object({
  recipientName: z.string().min(2).max(100),
  phone: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format"),
  address: z.string().min(5).max(200),
  city: z.string().min(1).max(100),
  state: z.enum(US_STATES, {
    errorMap: () => ({ message: "Invalid US state" }),
  }),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "ZIP code must be 5 digits or 5+4 format"),
  country: z.literal("US", {
    errorMap: () => ({ message: "Only United States is supported" }),
  }),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(["bank_transfer", "e_wallet", "cod"]),
  voucherUsageId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "awaiting_payment",
    "delivered",
    "cancelled",
  ]),
  note: z.string().max(500).optional(),
});

export type ShippingAddressDTO = z.infer<typeof shippingAddressSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;
