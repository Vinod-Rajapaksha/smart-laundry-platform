import { z } from "zod";
import { ORDER_STATUS, PAYMENT_METHODS } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createOrderSchema = z.object({
  serviceId: objectIdSchema,
  weightKg: z.coerce.number().min(0).optional().nullable(),
  reservedDateTime: z.string().datetime().optional().nullable(),
  pickupAddress: z.string().optional().nullable(),
  deliveryAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  extraFee: z.coerce.number().min(0).optional(),
  deliveryFee: z.coerce.number().min(0).optional(),
  paymentMethod: z.enum(Object.values(PAYMENT_METHODS) as [string, ...string[]]),
  options: z.array(objectIdSchema).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]),
});

export const orderIdParamSchema = z.object({
  id: objectIdSchema,
});

export const getOrdersQuerySchema = z.object({
  status: z.preprocess((val) => {
    if (!val || typeof val !== 'string' || val === 'All') return undefined;
    const v = val.toUpperCase();
    if (v === 'PENDING') return [
      ORDER_STATUS.ORDER_PLACED,
      ORDER_STATUS.PICKUP_ASSIGNED,
      ORDER_STATUS.PICKUP_ON_THE_WAY,
      ORDER_STATUS.PICKUP_ARRIVED,
      ORDER_STATUS.PICKED_UP,
      ORDER_STATUS.HANDED_OVER,
      ORDER_STATUS.WASHING,
      ORDER_STATUS.DRYING,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.READY,
      ORDER_STATUS.DELIVERY_ASSIGNED,
      ORDER_STATUS.DELIVERY_ON_THE_WAY,
      ORDER_STATUS.DELIVERY_ARRIVED
    ];
    if (v === 'PICKUP') return [
      ORDER_STATUS.PICKUP_ASSIGNED,
      ORDER_STATUS.PICKUP_ON_THE_WAY,
      ORDER_STATUS.PICKUP_ARRIVED,
      ORDER_STATUS.PICKED_UP
    ];
    if (v === 'PROCESSING') return [
      ORDER_STATUS.HANDED_OVER,
      ORDER_STATUS.WASHING,
      ORDER_STATUS.DRYING,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.READY
    ];
    if (v === 'DELIVERY') return [
      ORDER_STATUS.DELIVERY_ASSIGNED,
      ORDER_STATUS.DELIVERY_ON_THE_WAY,
      ORDER_STATUS.DELIVERY_ARRIVED,
      ORDER_STATUS.DELIVERED
    ];
    if (v === 'COMPLETED') return [ORDER_STATUS.DELIVERED];
    return v;
  }, z.union([
    z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]),
    z.array(z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]))
  ]).optional()),
  userId: objectIdSchema.optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const updateOrderSchema = z.object({
  weightKg: z.coerce.number().min(0).optional(),
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderIdParamInput = z.infer<typeof orderIdParamSchema>;
export type GetOrdersQueryInput = z.infer<typeof getOrdersQuerySchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
