import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createServiceCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be a positive number").optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceCategorySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  isActive: z.boolean().optional(),
});

export const serviceCategoryIdParamSchema = z.object({
  id: objectIdSchema,
});

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
export type ServiceCategoryIdParamInput = z.infer<typeof serviceCategoryIdParamSchema>;
