import { Request, Response, NextFunction } from "express";
import { Role } from "../../core/constants.js";

const isEmail = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidPhone = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(\+94|0)7\d{8}$/.test(value);

const isStrongPassword = (value: unknown): value is string =>
  typeof value === "string" &&
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && (["ADMIN", "STAFF", "CUSTOMER"] as const).includes(value as any);

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { name, email, telephone, address, password, role } = req.body as Record<string, unknown>;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  if (!email || !isEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid email is required" });
  }

  if (!telephone || !isValidPhone(telephone)) {
    return res.status(400).json({
      success: false,
      message:
        "Telephone must be a valid mobile number (07XXXXXXXX or +947XXXXXXXX)",
    });
  }

  if (address !== undefined && typeof address !== "string") {
    return res.status(400).json({
      success: false,
      message: "Address must be a string",
    });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  if (role !== undefined && !isRole(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { email, password } = req.body as Record<string, unknown>;

  if (!email || !isEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid email is required" });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  next();
};

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { refreshToken } = req.body as Record<string, unknown>;

  if (!refreshToken || typeof refreshToken !== "string") {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  next();
};