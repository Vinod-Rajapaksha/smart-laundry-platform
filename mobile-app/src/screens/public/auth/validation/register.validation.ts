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
  const trimmedName = fullName.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPhone = phone.trim();

  if (
    !trimmedName ||
    !trimmedEmail ||
    !trimmedPhone ||
    !password ||
    !confirmPassword
  ) {
    return "Please fill in all fields.";
  }

  if (trimmedName.length < 3) {
    return "Full name must be at least 3 characters.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  const phoneDigits = trimmedPhone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return "Please enter a valid phone number.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number.";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  if (!agreeTerms) {
    return "You must agree to the Terms & Conditions.";
  }

  return "";
};