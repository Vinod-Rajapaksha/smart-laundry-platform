import { z } from 'zod';

export const validateCreateInventory = {
  body: z.object({
    categoryName: z.string().min(1, 'Category name is required'),
    name: z.string().min(1, 'Name is required'),
    sku: z.string().optional().nullable(),
    unit: z.enum(['PCS', 'KG', 'L', 'ML'], {
      error: 'Unit is required',
    }),
    unitPrice: z.number().min(0, 'Unit price cannot be negative'),
    qtyInStock: z.number().min(0, 'Quantity cannot be negative').optional(),
    reorderLevel: z.number().min(0, 'Reorder level cannot be negative').optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    description: z.string().optional().nullable(),
    supplierId: z.string().min(1, 'Supplier is required'),
    batchQty: z.number().min(1).optional(),
    isOrderPending: z.boolean().optional(),
  }),
};

export const validateUpdateInventory = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Inventory ID'),
  }),
  body: z.object({
    categoryName: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    sku: z.string().optional().nullable(),
    unit: z.enum(['PCS', 'KG', 'L', 'ML']).optional(),
    unitPrice: z.number().min(0).optional(),
    qtyInStock: z.number().min(0).optional(),
    reorderLevel: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    description: z.string().optional().nullable(),
    batchQty: z.number().min(1).optional(),
    isOrderPending: z.boolean().optional(),
  }),
};

export const validateInventoryId = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Inventory ID'),
  }),
};

export const validateGetInventory = {
  query: z.object({
    category: z.string().optional(),
    isActive: z.string().transform((val) => val === 'true').optional(),
    isDefault: z.string().transform((val) => val === 'true').optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
};
