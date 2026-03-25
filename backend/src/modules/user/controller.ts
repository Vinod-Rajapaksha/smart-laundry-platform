import { Request, Response } from "express";
import * as userService from "./service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../core/apiResponse.js";
import { Role } from "../../core/constants.js";

interface CreateUserBody {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
  role?: Role;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  password?: string;
}

export const createUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
    const { name, email, telephone, address, password, role } = req.body;

    const user = await userService.createUser({
      name,
      email,
      telephone,
      address,
      password,
      role,
    });

    return ApiResponse(res, 201, "User created successfully", user);
  }
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const search = req.query.search as string;
    const role = req.query.role as Role;

    const result = await userService.getAllUsers({
      page,
      limit,
      search,
      role,
    });

    return ApiResponse(res, 200, "Users retrieved successfully", result);
  }
);

export const getUserById = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    return ApiResponse(res, 200, "User retrieved successfully", user);
  }
) as any;

export const updateUser = asyncHandler(
  async (req: Request<any, any, UpdateUserBody>, res: Response) => {
    const { id } = req.params;
    const { name, email, telephone, address, password } = req.body;

    const user = await userService.updateUser(id, {
      name,
      email,
      telephone,
      address,
      password,
    });

    return ApiResponse(res, 200, "User updated successfully", user);
  }
) as any;

export const deleteUser = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const { id } = req.params;

    await userService.deleteUser(id);

    return ApiResponse(res, 200, "User deleted successfully");
  }
) as any;

export const toggleUserStatus = asyncHandler(
  async (req: Request<any>, res: Response) => {
    const { id } = req.params;

    const user = await userService.toggleUserStatus(id);

    return ApiResponse(res, 200, "User status updated successfully", user);
  }
) as any;

export const getUserStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await userService.getUserCountByRole();

    return ApiResponse(res, 200, "User statistics retrieved successfully", stats);
  }
);
