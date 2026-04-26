import { z } from "zod";

export const serviceUnits = ["KG", "PCS", "SET", "L", "ML"] as const;

export const serviceCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  price: z.number().nonnegative("Base price must be non-negative").default(0),
  isActive: z.boolean(),
});

export const serviceSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required").optional(),
  category: z.string().min(1, "Category name is required").optional(),
  name: z.string().min(1, "Service name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  unit: z.enum(serviceUnits),
  description: z.string().optional(),
  isPopular: z.boolean(),
  isActive: z.boolean(),
  inventoryItems: z.array(z.object({
    itemId: z.string().min(1, "Inventory item is required"),
    quantity: z.number().positive("Quantity must be positive"),
  })).optional(),
});

export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
