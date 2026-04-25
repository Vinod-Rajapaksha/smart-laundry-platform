import { z } from "zod";
import { roles } from "./auth.schema.js";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  telephone: z.string().regex(/^(\+94|0)7\d{8}$/, "Enter a valid mobile number"),
  address: z.string().optional(),
  role: z.enum(roles),
  staffType: z.enum(["STORE", "DELIVERY", "BOTH"]).nullable().optional(),
  salary: z.number().min(0).nullable().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  telephone: z.string().regex(/^(\+94|0)7\d{8}$/, "Enter a valid mobile number").optional(),
  address: z.string().optional(),
  role: z.enum(roles).optional(),
  staffType: z.enum(["STORE", "DELIVERY", "BOTH"]).nullable().optional(),
  salary: z.number().min(0).nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
