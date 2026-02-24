import { Request, Response } from "express";
import * as authService from "./service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../core/apiResponse.js";
import { Role } from "../../core/constants.js";

type RegisterBody = {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
  role: Role;
};

type LoginBody = {
  email: string;
  password: string;
};

type RefreshBody = {
  refreshToken: string;
};

export const register = asyncHandler(
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { name, email, telephone, address, password, role } = req.body;

    const user = await authService.register({
      name,
      email,
      telephone,
      address,
      password,
      role,
    });

    return ApiResponse(res, 201, "User registered successfully", user);
  }
);

export const login = asyncHandler(
  async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    return ApiResponse(res, 200, "Login successful", result);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request<{}, {}, RefreshBody>, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken({ refreshToken });

    return ApiResponse(res, 200, "Token refreshed successfully", tokens);
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return ApiResponse(res, 401, "Unauthorized");
    }

    await authService.logout(userId);

    return ApiResponse(res, 200, "Logged out successfully");
  }
);