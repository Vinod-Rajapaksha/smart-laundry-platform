import { z } from 'zod';

export const validateCreateVoucher = {
  body: z.object({
    code: z.string().min(1),
    voucherType: z.string().min(1),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().min(0),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    usageLimitPerUser: z.number().min(1).optional(),
    usageLimitTotal: z.number().min(1).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
};

export const validateVoucherCode = {
  params: z.object({
    code: z.string().min(1),
  }),
};

export const validateApplyVoucher = {
  body: z.object({
    code: z.string().min(1),
    orderAmount: z.number().min(0),
  }),
};

export const validateApplyToOrder = {
  body: z.object({
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    voucherCode: z.string().min(1),
  }),
};

export const validateRedeemVoucher = {
  body: z.object({
    voucherId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  }),
};
