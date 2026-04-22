import { Response } from 'express';
import { ApiResponse } from '../../core/apiResponse.js';
import { AuthRequest } from '../../types/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as settingsService from './service.js';

export const getFeedbackSettings = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const settings = await settingsService.getFeedbackSettings();
  return ApiResponse(res, 200, 'Feedback settings retrieved', settings);
});

export const updateAISummaryToggle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { enabled } = req.body;
  await settingsService.updateSetting('ai_summary_enabled', enabled, 'Toggle for AI-generated feedback summary on public site');
  return ApiResponse(res, 200, `AI Summary ${enabled ? 'enabled' : 'disabled'} successfully`);
});
