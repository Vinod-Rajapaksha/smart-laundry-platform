import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (
  plainPassword: string
): Promise<string> => {
  if (!plainPassword) {
    throw new Error("Password is required");
  }

  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};