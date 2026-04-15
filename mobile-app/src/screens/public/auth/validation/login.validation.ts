import { loginSchema } from "../../../../validation/auth.schema";

export const validateLoginForm = (email: string, password: string): string => {
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return result.error.issues[0].message;
  }
  return "";
};