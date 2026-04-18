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
