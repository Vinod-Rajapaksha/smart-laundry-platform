import { Request, Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler.js';
import { initBankTransferPayment, initCODPayment, initCardPayment, getPaymentDashboardStats, getAllPayments, adminVerifyPayment } from '../service/payment.service.js';
import { ApiResponse } from '../../../core/apiResponse.js';
import ApiError from '../../../core/apiError.js';

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
  const { saveCard } = req.body;
  const data = await initCardPayment(orderId, userId, saveCard);

  return ApiResponse(res, 201, 'Card payment initiated successfully', data);
});

export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const payments = await getAllPayments({ status });
  return ApiResponse(res, 200, 'Payments fetched successfully', payments);
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['PAID', 'FAILED'].includes(status)) {
    throw new ApiError(400, 'Invalid status. Use PAID or FAILED');
  }

  const payment = await adminVerifyPayment(id as string, status);
  return ApiResponse(res, 200, `Payment ${status.toLocaleLowerCase()} successfully`, payment);
});