import { z } from 'zod';

export const validateCreateService = {
  body: z.object({
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID'),
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price cannot be negative'),
    unit: z.enum(['KG', 'PCS', 'SET', 'L', 'ML']).optional(),
    isActive: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    description: z.string().nullable().optional(),
    inventoryItems: z.array(z.object({
      itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Inventory ID'),
      quantity: z.number().min(0.01),
    })).optional(),
  }),
};

export const validateUpdateService = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Service ID'),
  }),
  body: z.object({
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Category ID').optional(),
    name: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    unit: z.enum(['KG', 'PCS', 'SET', 'L', 'ML']).optional(),
    isActive: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    description: z.string().nullable().optional(),
    inventoryItems: z.array(z.object({
      itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Inventory ID'),
      quantity: z.number().min(0.01),
    })).optional(),
  }),
};

export const validateServiceId = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Service ID'),
  }),
};
