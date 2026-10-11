import { z } from "zod";

export const createVoucherSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(50)
    .regex(
      /^[A-Z0-9]+$/,
      "Code must contain only uppercase letters and numbers",
    ),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  category: z
    .enum(["discount", "free_shipping", "new_user"])
    .default("discount"),
  value: z.number().positive(),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  perUserLimit: z.number().int().positive().default(1),
});

export const updateVoucherSchema = createVoucherSchema.partial();

export const validateVoucherSchema = z.object({
  voucherUsageId: z.string().min(1, "Voucher usage ID is required"),
  orderAmount: z.number().positive(),
});

export type CreateVoucherDTO = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherDTO = z.infer<typeof updateVoucherSchema>;
export type ValidateVoucherDTO = z.infer<typeof validateVoucherSchema>;

export interface VoucherResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  value: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: Date;
  endDate: Date;
  usageCount: number;
  perUserLimit: number;
  isActiveNow: boolean;
  createdAt: Date;
  updatedAt: Date;
}
