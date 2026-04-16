import { Response } from 'express';
import { AuthRequest } from '../../../types/auth.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import { submitBankTransfer, getFilteredTransfers, verifyTransfer } from '../service/bankTransfer.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';
import ApiError from '../../../core/apiError.js';

export const getTransfersHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.set('Cache-Control', 'no-store');

  const { status, search } = req.query;
  const result = await getFilteredTransfers(status as string, search as string);
  
  return ApiResponse(res, 200, 'Transfers fetched successfully', result);
});

export const submitTransferHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { orderId, bankName, referenceNo } = req.body;
  const file = req.file;

  if (!userId) throw new ApiError(401, 'Unauthorized');
  if (!file) throw new ApiError(400, 'Payment slip is required');

  const result = await submitBankTransfer(userId, orderId, bankName, referenceNo, file);

  return ApiResponse(res, 201, 'Bank transfer submitted successfully', result);
});

export const verifyTransferHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const adminId = req.user?.id;
  const id = typeof req.params.id === 'string' ? req.params.id : String(req.params.id);
  const { status, isSuspicious, internalNotes, rejectReason } = req.body;

  if (!adminId) throw new ApiError(401, 'Unauthorized');

  const result = await verifyTransfer(id, adminId, status, isSuspicious, internalNotes, rejectReason);

  return ApiResponse(res, 200, 'Transfer verification updated successfully', result);
});
