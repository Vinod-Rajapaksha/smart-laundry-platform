import { z } from 'zod';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const validateCreateCategory = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be a positive number').optional(),
    isActive: z.boolean().optional(),
  }),
};

export const validateUpdateCategory = {
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid category ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    price: z.number().min(0, 'Price must be a positive number').optional(),
    isActive: z.boolean().optional(),
  }),
};

export const validateCategoryId = {
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid category ID'),
  }),
};
