import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  isActive: z.boolean(),
});

export const serviceCategorySchema = categorySchema.extend({
  price: z.number().min(0, "Base price must be a non-negative number"),
});

export const inventoryCategorySchema = categorySchema.extend({
  description: z.string().optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type InventoryCategoryInput = z.infer<typeof inventoryCategorySchema>;
