import { z } from "zod";

export const validateVoucherSchema = z.object({
  code: z.string().min(1, "Voucher code is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
});

export type ValidateVoucherInput = z.infer<typeof validateVoucherSchema>;
