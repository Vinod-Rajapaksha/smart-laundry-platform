import { Request, Response } from 'express';
import * as service from './loyalty.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getLoyaltyStatus((req as any).user.id);
  return ApiResponse(res, 200, 'Loyalty status fetched', result);
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getLoyaltyHistory((req as any).user.id);
  return ApiResponse(res, 200, 'Loyalty history fetched', result);
});

export const getTiers = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getAllTiers();
  return ApiResponse(res, 200, 'Loyalty tiers fetched', result);
});
