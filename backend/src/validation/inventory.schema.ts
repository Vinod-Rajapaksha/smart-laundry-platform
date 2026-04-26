import { z } from "zod";
import { UNITS } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createInventorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional().nullable(),
  unit: z.enum(Object.values(UNITS) as [string, ...string[]], {
    message: "Valid unit is required",
  }),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
  qtyInStock: z.coerce.number().min(0, "Quantity cannot be negative").optional(),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative").optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  description: z.string().optional().nullable(),
  supplierId: objectIdSchema,
  batchQty: z.coerce.number().min(1).optional(),
  isOrderPending: z.boolean().optional(),
});

export const updateInventorySchema = z.object({
  categoryName: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  sku: z.string().optional().nullable(),
  unit: z.enum(Object.values(UNITS) as [string, ...string[]]).optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  qtyInStock: z.coerce.number().min(0).optional(),
  reorderLevel: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  description: z.string().optional().nullable(),
  batchQty: z.coerce.number().min(1).optional(),
  isOrderPending: z.boolean().optional(),
});

export const inventoryIdParamSchema = z.object({
  id: objectIdSchema,
});

export const getInventoryQuerySchema = z.object({
  category: z.string().optional(),
  status: z.enum(["low", "inactive"]).optional(),
  isActive: z.string().transform((val) => val === "true").optional(),
  isDefault: z.string().transform((val) => val === "true").optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type InventoryIdParamInput = z.infer<typeof inventoryIdParamSchema>;
export type GetInventoryQueryInput = z.infer<typeof getInventoryQuerySchema>;
