import User from "../../database/models/User.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  AuthPayload,
} from "../../utils/jwt.js";
import ApiError from "../../core/apiError.js";
import { Role } from "../../core/constants.js";
import { sendSms } from "../../utils/smsService.js";

type RegisterInput = {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
  role?: Role;
};

type LoginInput = {
  email: string;
  password: string;
};

type RefreshInput = {
  refreshToken: string;
};

export const register = async ({
  name,
  email,
  telephone,
  address,
  password,
  role,
}: RegisterInput) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(409, "Email is already in use");

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
  delete (userData as any).password;
  delete (userData as any).refreshToken;

  return userData;
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is disabled");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  const payload: AuthPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  const userData = user.toObject();
  delete (userData as any).password;
  delete (userData as any).refreshToken;

  return { user: userData, accessToken, refreshToken };
};

export const refreshToken = async ({ refreshToken }: RefreshInput) => {
  let decoded: AuthPayload;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) throw new ApiError(401, "User not found or inactive");
  if (user.refreshToken !== refreshToken) throw new ApiError(401, "Refresh token does not match");

  const payload: AuthPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save();

  return true;
};

export const sendForgotPasswordOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    // For security, don't reveal if user exists. Just return true.
    return true;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 mins expiry

  user.otp = otp;
  user.otpExpiresAt = expiresAt;
  await user.save();

  // Send via SMSlenz
  await sendSms(user.telephone, `Your password reset OTP is ${otp}. Valid for 10 minutes.`);

  return true;
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() }
  });

  if (!user) throw new ApiError(400, "Invalid or expired OTP");

  return true;
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await User.findOne({
    email,
    otp,
    otpExpiresAt: { $gt: new Date() }
  });

  if (!user) throw new ApiError(400, "Invalid or expired OTP");

  const hashed = await hashPassword(newPassword);

  user.password = hashed;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  return true;
};
