import { Response } from 'express';
import { AuthRequest } from '../../../types/auth.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { getFilteredOnlineTransactions } from '../service/onlineTransaction.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';

export const getOnlineTransactionsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.set('Cache-Control', 'no-store');

  const { status, search } = req.query;
  const result = await getFilteredOnlineTransactions(status as string, search as string);
  
  return ApiResponse(res, 200, 'Online transactions fetched successfully', result);
});
