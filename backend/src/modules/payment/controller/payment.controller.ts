import { Request, Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler.js';
import { initBankTransferPayment, initCODPayment, initCardPayment } from '../service/payment.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';

export const initBankTransfer = asyncHandler(async (req: Request, res: Response) => {
  const orderId = String(req.params.orderId);

  const userId = (req as any).user?.id;

  const data = await initBankTransferPayment(orderId, userId);

  return ApiResponse(res, 201, 'Bank transfer initiated', data);
});

export const initCOD = asyncHandler(async (req: Request, res: Response) => {
  const orderId = String(req.params.orderId);
  const userId = (req as any).user?.id;

  const data = await initCODPayment(orderId, userId);

  return ApiResponse(res, 201, 'COD payment initiated', data);
});

export const initCard = asyncHandler(async (req: Request, res: Response) => {
  const orderId = String(req.params.orderId);
  const userId = (req as any).user?.id;

  const data = await initCardPayment(orderId, userId);

  return ApiResponse(res, 201, 'Card payment initiated successfully', data);
});