import User from "../../database/models/User.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, } from "../../utils/jwt.js";
const createError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};
export const register = async ({ name, email, telephone, address, password, role, }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser)
        throw createError("Email is already in use", 409);
    const hashed = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        telephone,
        address,
        password: hashed,
        role: role ?? "CUSTOMER",
    });
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    return userData;
};
export const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user)
        throw createError("Invalid email or password", 401);
    if (!user.isActive)
        throw createError("Account is disabled", 403);
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
        throw createError("Invalid email or password", 401);
    const payload = {
        id: user._id.toString(),
        role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    user.refreshToken = refreshToken;
    await user.save();
    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshToken;
    return { user: userData, accessToken, refreshToken };
};
export const refreshToken = async ({ refreshToken }) => {
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    }
    catch {
        throw createError("Invalid refresh token", 401);
    }
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive)
        throw createError("User not found or inactive", 401);
    if (user.refreshToken !== refreshToken)
        throw createError("Refresh token does not match", 401);
    const payload = {
        id: user._id.toString(),
        role: user.role,
    };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    user.refreshToken = newRefreshToken;
    await user.save();
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
export const logout = async (userId) => {
    const user = await User.findById(userId);
    if (!user)
        throw createError("User not found", 404);
    user.refreshToken = null;
    await user.save();
    return true;
};
