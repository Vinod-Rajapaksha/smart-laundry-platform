import { Response } from 'express';
import { ApiResponse } from '../../core/apiResponse.js';
import { AuthRequest } from '../../types/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as service from './service.js';

export const getAllCategories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const categories = await service.getAllCategories();
  return ApiResponse(res, 200, 'Inventory categories retrieved successfully', categories);
});

export const getCategoryById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await service.getCategoryById(req.params.id as string);
  return ApiResponse(res, 200, 'Inventory category retrieved successfully', category);
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await service.createCategory(req.body);
  return ApiResponse(res, 201, 'Inventory category created successfully', category);
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await service.updateCategory(req.params.id as string, req.body);
  return ApiResponse(res, 200, 'Inventory category updated successfully', category);
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await service.deleteCategory(req.params.id as string);
  return ApiResponse(res, 200, 'Inventory category deleted successfully');
});
