import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;
export const hashPassword = async (plainPassword) => {
    if (!plainPassword) {
        throw new Error("Password is required");
    }
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
};
export const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};
