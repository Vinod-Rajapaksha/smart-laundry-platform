import { Response } from 'express';
import { AuthRequest } from '../../../types/auth.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { getFilteredCashOnDeliveries, confirmCODPayment } from '../service/cod.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';

export const getCashOnDeliveriesHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.set('Cache-Control', 'no-store');

  const { status, search } = req.query;
  const result = await getFilteredCashOnDeliveries(status as string, search as string);
  
  return ApiResponse(res, 200, 'COD transactions fetched successfully', result);
});

export const confirmCOD = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { orderId } = req.body;

  if (!userId) {
    return ApiResponse(res, 401, 'Unauthorized');
  }

  const result = await confirmCODPayment(orderId, userId);

  return ApiResponse(res, 201, 'COD payment confirmed successfully', result);
});
