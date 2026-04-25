import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const createVoucher = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.createVoucher(req.body);
  return ApiResponse(res, 201, 'Voucher created successfully', data);
});

export const getAllVouchers = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getAllVouchers(req.query);
  return ApiResponse(res, 200, 'Vouchers fetched successfully', data);
});

export const getVoucherByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const data = await service.getVoucherByCode(code as string);
  return ApiResponse(res, 200, 'Voucher fetched successfully', data);
});

export const validateVoucher = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { code, orderAmount } = req.body;
  const data = await service.validateVoucher(code, userId, Number(orderAmount));
  return ApiResponse(res, 200, 'Voucher is valid', data);
});

export const redeemVoucher = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { voucherId, orderId } = req.body;
  const data = await service.redeemVoucher(voucherId, userId, orderId);
  return ApiResponse(res, 201, 'Voucher redeemed successfully', data);
});

export const applyToOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { orderId, voucherCode } = req.body;
  const data = await service.applyVoucherToOrder(orderId, userId, voucherCode);
  return ApiResponse(res, 200, 'Voucher applied to order successfully', data);
});
