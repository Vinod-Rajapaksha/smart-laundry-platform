import { z } from "zod";

export const roles = ["ADMIN", "STAFF", "CUSTOMER"] as const;

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  telephone: z.string().regex(/^(\+94|0)7\d{8}$/, "Telephone must be a valid mobile number"),
  address: z.string().optional(),
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
  ),
  role: z.enum(roles).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
