import { z } from "zod";
import { VOUCHER_TYPE, DISCOUNT_TYPE } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createVoucherSchema = z.object({
  code: z.string().min(1, "Code is required"),
  voucherType: z.enum(Object.values(VOUCHER_TYPE) as [string, ...string[]]),
  discountType: z.enum(Object.values(DISCOUNT_TYPE) as [string, ...string[]]),
  discountValue: z.coerce.number().min(0),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimitPerUser: z.coerce.number().min(1).optional(),
  usageLimitTotal: z.coerce.number().min(1).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const updateVoucherSchema = createVoucherSchema.partial();

export const voucherCodeParamSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const applyVoucherSchema = z.object({
  code: z.string().min(1, "Code is required"),
  orderAmount: z.coerce.number().min(0),
});

export const applyToOrderSchema = z.object({
  orderId: objectIdSchema,
  voucherCode: z.string().min(1, "Voucher code is required"),
});

export const redeemVoucherSchema = z.object({
  voucherId: objectIdSchema,
  orderId: objectIdSchema,
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherInput = z.infer<typeof updateVoucherSchema>;
export type VoucherCodeParamInput = z.infer<typeof voucherCodeParamSchema>;
export type ApplyVoucherInput = z.infer<typeof applyVoucherSchema>;
export type ApplyToOrderInput = z.infer<typeof applyToOrderSchema>;
export type RedeemVoucherInput = z.infer<typeof redeemVoucherSchema>;

