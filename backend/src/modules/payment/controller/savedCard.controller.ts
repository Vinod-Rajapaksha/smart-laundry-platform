import { Request, Response } from 'express';
import asyncHandler from '../../../utils/asyncHandler.js';
import SavedCard from '../../../database/models/SavedCard.js';
import { ApiResponse } from '../../../core/apiResponse.js';
import ApiError from '../../../core/apiError.js';

export const getSavedCards = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const cards = await SavedCard.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

  return ApiResponse(res, 200, 'Saved cards retrieved', cards);
});

export const createSavedCard = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { provider, last4, brand, expiryMonth, expiryYear, isDefault } = req.body;
  const cardToken = `token_${Math.random().toString(36).substring(2, 15)}`;

  if (isDefault) {
    await SavedCard.updateMany({ userId }, { isDefault: false });
  }

  const newCard = await SavedCard.create({
    userId,
    provider,
    cardToken,
    last4,
    brand,
    expiryMonth,
    expiryYear,
    isDefault: isDefault || false,
  });

  return ApiResponse(res, 201, 'Card saved successfully', newCard);
});

export const deleteSavedCard = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;
  const card = await SavedCard.findOneAndDelete({ _id: id, userId });
  
  if (!card) {
    throw new ApiError(404, 'Card not found');
  }

  return ApiResponse(res, 200, 'Card deleted successfully');
});

export const setDefaultCard = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { id } = req.params;

  await SavedCard.updateMany({ userId }, { isDefault: false });
  const card = await SavedCard.findOneAndUpdate(
    { _id: id, userId },
    { isDefault: true },
    { new: true }
  );

  if (!card) {
    throw new ApiError(404, 'Card not found');
  }

  return ApiResponse(res, 200, 'Default card updated', card);
});
