import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.createOrder((req as any).user.id, req.body);
  return ApiResponse(res, 201, 'Order created successfully', result);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.updateOrderStatus(
    req.params.id as string,
    req.body.status,
    (req as any).user.id
  );
  return ApiResponse(res, 200, 'Order status updated successfully', result);
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getOrderById(req.params.id as string);
  return ApiResponse(res, 200, 'Order fetched successfully', result);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getMyOrders((req as any).user.id, req.query);
  return ApiResponse(res, 200, 'My orders fetched successfully', result);
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getAllOrders(req.query);
  return ApiResponse(res, 200, 'All orders fetched successfully', result);
});