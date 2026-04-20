import { z } from 'zod';

export const validateCreateOrder = {
  body: z.object({
    serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Service ID'),
    weightKg: z.number().min(0).optional().nullable(),
    reservedDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }).optional().nullable(),
    pickupAddress: z.string().optional().nullable(),
    deliveryAddress: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    extraFee: z.number().min(0).optional(),
    deliveryFee: z.number().min(0).optional(),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    options: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Inventory Item ID')).optional(),
  }),
};

export const validateUpdateOrderStatus = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
  body: z.object({
    status: z.string().min(1, 'Status is required'),
  }),
};

export const validateOrderId = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
};

export const validateGetOrders = {
  query: z.object({
    status: z.string().optional(),
    userId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
};
export const validateUpdateOrder = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Order ID'),
  }),
  body: z.object({
    weightKg: z.number().min(0).optional(),
    pickupAddress: z.string().optional(),
    deliveryAddress: z.string().optional(),
    notes: z.string().optional(),
    status: z.string().optional(),
  }),
};
