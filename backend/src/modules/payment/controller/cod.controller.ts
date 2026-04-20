import { Response } from 'express';
import CashOnDelivery from '../../../database/models/CashOnDelivery.js';
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
  const { id } = req.params;

  if (!userId) {
    return ApiResponse(res, 401, 'Unauthorized');
  }

  let result;
  if (id) {
    // Audit drawer confirm
    const codRecord = await CashOnDelivery.findById(id).populate('orderId');
    if (!codRecord) throw new Error('COD record not found');
    
    codRecord.status = 'COMPLETED';
    codRecord.collectedAt = new Date();
    await codRecord.save();
    
    // Also update order/payment
    await confirmCODPayment((codRecord.orderId as any).orderNo, userId);
    result = codRecord;
  } else {
    // Standard init/confirm
    result = await confirmCODPayment(orderId, userId);
  }

  return ApiResponse(res, 201, 'COD payment confirmed successfully', result);
});
