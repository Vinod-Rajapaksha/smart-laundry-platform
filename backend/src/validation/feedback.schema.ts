import { z } from "zod";
import { FEEDBACK_STATUS } from "../core/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createFeedbackSchema = z.object({
  orderId: objectIdSchema,
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional().nullable(),
  suggestions: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const updateMyFeedbackSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional().nullable(),
  suggestions: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export const updateFeedbackStatusSchema = z.object({
  status: z.enum(Object.values(FEEDBACK_STATUS) as [string, ...string[]]),
});

export const getFeedbacksQuerySchema = z.object({
  page: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  limit: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  status: z.enum(Object.values(FEEDBACK_STATUS) as [string, ...string[]]).optional(),
  rating: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const feedbackIdParamSchema = z.object({
  id: objectIdSchema,
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateMyFeedbackInput = z.infer<typeof updateMyFeedbackSchema>;
export type UpdateFeedbackStatusInput = z.infer<typeof updateFeedbackStatusSchema>;
export type GetFeedbacksQueryInput = z.infer<typeof getFeedbacksQuerySchema>;
