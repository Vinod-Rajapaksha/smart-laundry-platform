import { Request, Response } from 'express';
import * as service from './user/service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';
import { uploadToCloudinary } from '../../utils/cloudinary.js';
import ApiError from '../../core/apiError.js';

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

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await service.changePassword(userId, req.body);
  return ApiResponse(res, 200, 'Password changed successfully');
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  const userId = (req as any).user.id;
  
  // Upload to cloudinary
  const avatarUrl = await uploadToCloudinary(req.file.buffer, 'avatars');
  
  // Update user profile
  const result = await service.updateProfile(userId, { avatar: avatarUrl });
  
  return ApiResponse(res, 200, 'Avatar uploaded successfully', result);
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
