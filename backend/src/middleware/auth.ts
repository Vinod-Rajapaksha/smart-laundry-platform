import { Response, NextFunction } from "express";
import { verifyAccessToken, AuthPayload } from "../utils/jwt.js";
import User from "../database/models/User.js";
import { AuthRequest } from "../types/auth.js";

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded: AuthPayload = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Auth middleware error:", message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};