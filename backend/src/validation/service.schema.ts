import { z } from "zod";
import { UNITS } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createServiceSchema = z.object({
  categoryId: objectIdSchema,
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  unit: z.enum(Object.values(UNITS) as [string, ...string[]]).optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  description: z.string().nullable().optional(),
  inventoryItems: z.array(z.object({
    itemId: objectIdSchema,
    quantity: z.coerce.number().min(0.01),
  })).optional(),
});

export const updateServiceSchema = z.object({
  categoryId: objectIdSchema.optional(),
  name: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  unit: z.enum(Object.values(UNITS) as [string, ...string[]]).optional(),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  description: z.string().nullable().optional(),
  inventoryItems: z.array(z.object({
    itemId: objectIdSchema,
    quantity: z.coerce.number().min(0.01),
  })).optional(),
});

export const serviceIdParamSchema = z.object({
  id: objectIdSchema,
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceIdParamInput = z.infer<typeof serviceIdParamSchema>;
