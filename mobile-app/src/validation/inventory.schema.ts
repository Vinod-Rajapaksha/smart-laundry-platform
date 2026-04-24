import { z } from "zod";

export const inventoryUnits = ["PCS", "KG", "L"] as const;

export const inventorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  name: z.string().min(1, "Item name is required"),
  sku: z.string().nullable().optional(),
  unit: z.enum(inventoryUnits),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  qtyInStock: z.number().nonnegative("Quantity in stock must be non-negative").default(0),
  reorderLevel: z.number().nonnegative("Reorder level must be non-negative").default(0),
  isActive: z.boolean().default(true),
});

export type InventoryInput = z.infer<typeof inventorySchema>;
