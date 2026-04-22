import { z } from "zod";
import { ROLES, STAFF_TYPES } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const getUsersQuerySchema = z.object({
  role: z.preprocess((val) => {
    if (!val || typeof val !== 'string' || val === 'All Users') return undefined;
    return val.toUpperCase();
  }, z.enum(Object.values(ROLES) as [string, ...string[]]).optional()),
  isActive: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  telephone: z.string().min(10, "Telephone must be at least 10 characters"),
  address: z.string().optional(),
  role: z.enum(Object.values(ROLES) as [string, ...string[]]).default(ROLES.CUSTOMER),
  staffType: z.preprocess((val) => (val === "" ? null : val), z.enum(Object.values(STAFF_TYPES) as [string, ...string[]]).nullable().optional()),
  salary: z.preprocess((val) => (val === "" ? null : val), z.coerce.number().min(0).nullable().optional()),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  telephone: z.string().min(10).optional(),
  address: z.string().optional(),
  role: z.enum(Object.values(ROLES) as [string, ...string[]]).optional(),
  staffType: z.preprocess((val) => (val === "" ? null : val), z.enum(Object.values(STAFF_TYPES) as [string, ...string[]]).nullable().optional()),
  salary: z.preprocess((val) => (val === "" ? null : val), z.coerce.number().min(0).nullable().optional()),
  isActive: z.boolean().optional(),
});

export const userIdParamSchema = z.object({
  id: objectIdSchema,
});

export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
