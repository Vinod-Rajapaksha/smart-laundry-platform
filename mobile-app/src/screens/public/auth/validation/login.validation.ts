export const validateLoginForm = (email: string, password: string): string => {
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password.trim()) {
    return "Please enter both email and password.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  return "";
};