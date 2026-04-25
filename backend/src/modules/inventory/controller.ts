import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.createInventory(req.body);
  return ApiResponse(res, 201, 'Inventory item created successfully', result);
});

export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.updateInventory(req.params.id as string, req.body);
  return ApiResponse(res, 200, 'Inventory item updated successfully', result);
});

export const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteInventory(req.params.id as string);
  return ApiResponse(res, 200, 'Inventory item deleted successfully');
});

export const getInventoryById = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getInventoryById(req.params.id as string);
  return ApiResponse(res, 200, 'Inventory item fetched successfully', result);
});

export const getAllInventory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getAllInventory(req.query);
  return ApiResponse(res, 200, 'All inventory items fetched successfully', result);
});

export const getInventoryByCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getInventoryByCategory(req.params.category as string);
  return ApiResponse(res, 200, `Inventory items for category ${req.params.category} fetched successfully`, result);
});

export const markOrdered = asyncHandler(async (req: Request, res: Response) => {
    const result = await service.markAsOrdered(req.params.id as string, req.body.qty);
    return ApiResponse(res, 200, 'Reorder email sent and item marked as ordered', result);
});

export const confirmRestock = asyncHandler(async (req: Request, res: Response) => {
    const result = await service.confirmRestock(req.params.id as string, req.body.qty);
    return ApiResponse(res, 200, 'Stock replenished successfully', result);
});
