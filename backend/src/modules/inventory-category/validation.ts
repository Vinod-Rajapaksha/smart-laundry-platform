import { z } from 'zod';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const validateCreateInventoryCategory = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
};

export const validateUpdateInventoryCategory = {
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid category ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
};

export const validateInventoryCategoryId = {
  params: z.object({
    id: z.string().regex(mongoIdRegex, 'Invalid category ID'),
  }),
};
