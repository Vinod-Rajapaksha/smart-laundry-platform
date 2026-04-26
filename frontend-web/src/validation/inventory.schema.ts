import { z } from "zod";

export const inventoryUnits = ["PCS", "KG", "L", "ML", "SET"] as const;

export const inventorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  name: z.string().min(1, "Item name is required"),
  sku: z.string().optional(),
  unit: z.enum(inventoryUnits),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  qtyInStock: z.number().nonnegative("Quantity in stock must be non-negative"),
  reorderLevel: z.number().nonnegative("Reorder level must be non-negative"),
  batchQty: z.number().nonnegative("Batch quantity must be non-negative"),
  supplierId: z.string().min(1, "Supplier is required"),
  isActive: z.boolean(),
});

export type InventoryInput = z.infer<typeof inventorySchema>;
