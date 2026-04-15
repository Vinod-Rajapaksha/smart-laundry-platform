import { z } from "zod";

export const serviceCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  price: z.number().nonnegative("Base price must be non-negative").default(0),
  isActive: z.boolean().default(true),
});

export const serviceSchema = z.object({
  categoryId: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Service name is required"),
  price: z.number().nonnegative("Price must be non-negative"),
});

export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
