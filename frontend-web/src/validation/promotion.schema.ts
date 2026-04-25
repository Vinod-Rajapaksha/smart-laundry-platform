import { z } from "zod";

export const voucherType = ["PUBLIC", "SEASONAL"] as const;
export const discountType = ["PERCENTAGE", "FIXED"] as const;

const voucherBase = z.object({
  code: z.string().min(1, "Voucher code is required").toUpperCase(),
  voucherType: z.enum(voucherType),
  discountType: z.enum(discountType),
  discountValue: z.number().min(0, "Discount value must be non-negative"),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimitPerUser: z.number().min(1).optional(),
  usageLimitTotal: z.number().min(1).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  isActive: z.boolean(),
});

export const createVoucherSchema = voucherBase.refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const updateVoucherSchema = voucherBase.partial().refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const validateVoucherSchema = z.object({
  code: z.string().min(1, "Voucher code is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
});

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
export type UpdateVoucherInput = z.infer<typeof updateVoucherSchema>;
export type ValidateVoucherInput = z.infer<typeof validateVoucherSchema>;
