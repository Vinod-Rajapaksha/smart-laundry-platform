export type PasswordStrengthResult = {
  score: number;
  label: "NONE" | "WEAK" | "FAIR" | "GOOD" | "STRONG";
};

export const getPasswordStrength = (password: string): PasswordStrengthResult => {
  if (!password) {
    return { score: 0, label: "NONE" };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels: PasswordStrengthResult["label"][] = [
    "WEAK",
    "WEAK",
    "FAIR",
    "GOOD",
    "STRONG",
  ];

  return {
    score,
    label: labels[score],
  };
};