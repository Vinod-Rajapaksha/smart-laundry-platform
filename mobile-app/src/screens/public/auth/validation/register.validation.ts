import { registerSchema } from "../../../../validation/auth.schema";

export const validateRegisterForm = ({
  fullName,
  email,
  phone,
  password,
  confirmPassword,
  agreeTerms,
}: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}): string => {

  if (!agreeTerms) {
    return "You must agree to the Terms & Conditions.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  const result = registerSchema.safeParse({
    name: fullName,
    email: email,
    telephone: phone,
    password: password,
    role: "CUSTOMER",
  });

  if (!result.success) {
    return result.error.issues[0].message;
  }

  return "";
};