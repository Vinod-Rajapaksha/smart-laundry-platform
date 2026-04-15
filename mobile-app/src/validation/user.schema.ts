import { z } from "zod";
import { roles } from "./auth.schema.js";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  telephone: z.string().regex(/^(\+94|0)7\d{8}$/, "Telephone must be a valid mobile number (07XXXXXXXX or +947XXXXXXXX)").optional(),
  address: z.string().optional(),
  role: z.enum(roles).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
