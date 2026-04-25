import { z } from 'zod';

export const validateGetUsers = {
  query: z.object({
    role: z.string().optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
};

export const validateCreateUser = {
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    telephone: z.string().min(10, 'Telephone must be at least 10 characters'),
    address: z.string().optional(),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).default('CUSTOMER'),
    staffType: z.enum(['DELIVERY', 'STORE', 'BOTH']).nullable().optional(),
    salary: z.number().min(0).nullable().optional(),
  }),
};

export const validateUpdateUser = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    telephone: z.string().min(10).optional(),
    address: z.string().optional(),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).optional(),
    staffType: z.enum(['DELIVERY', 'STORE', 'BOTH']).nullable().optional(),
    salary: z.number().min(0).nullable().optional(),
    isActive: z.boolean().optional(),
  }),
};

export const validateUserId = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID'),
  }),
};
