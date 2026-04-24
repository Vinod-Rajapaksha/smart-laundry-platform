import { z } from "zod";

export const orderStatus = ["CREATED", "PICKED_UP", "IN_PROGRESS", "COMPLETED", "DELIVERED", "CANCELLED"] as const;

export const createOrderSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  weight: z.number().positive("Weight must be positive").optional(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
  })).optional(),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  notes: z.string().optional(),
});

export const orderNoParamSchema = z.object({
  orderNo: z.string().min(1, "Valid order number is required"),
});

export const orderIdParamSchema = z.object({
  id: z.string().min(1, "Valid order ID is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
