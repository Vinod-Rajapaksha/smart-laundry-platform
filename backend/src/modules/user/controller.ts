import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await service.getProfile(userId);
  return ApiResponse(res, 200, 'User profile fetched successfully', result);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await service.updateProfile(userId, req.body);
  return ApiResponse(res, 200, 'User profile updated successfully', result);
});

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, isActive, search } = req.query;
  const filters = {
    role: role as string,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    search: search as string,
  };
  const result = await service.getUsers(filters);
  return ApiResponse(res, 200, 'Users fetched successfully', result);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.createUser(req.body);
  return ApiResponse(res, 201, 'User created successfully', result);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getUserById(req.params.id as string);
  return ApiResponse(res, 200, 'User fetched successfully', result);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.updateAnyUser(req.params.id as string, req.body);
  return ApiResponse(res, 200, 'User updated successfully', result);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await service.softDeleteUser(req.params.id as string);
  return ApiResponse(res, 200, 'User deleted successfully (Soft delete)');
});
