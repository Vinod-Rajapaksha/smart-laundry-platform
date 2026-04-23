import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const data = await service.getMyNotifications(userId);
  return ApiResponse(res, 200, 'Notifications fetched successfully', data);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const data = await service.markAsRead(id as string, userId);
  return ApiResponse(res, 200, 'Notification marked as read', data);
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await service.markAllAsRead(userId);
  return ApiResponse(res, 200, 'All notifications marked as read', null);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  await service.deleteNotification(id as string, userId);
  return ApiResponse(res, 204, 'Notification deleted successfully', null);
});

export const updatePushToken = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { token } = req.body;
  await service.updatePushToken(userId, token);
  return ApiResponse(res, 200, 'Push token updated successfully', null);
});
