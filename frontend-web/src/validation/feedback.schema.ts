import { z } from "zod";

export const feedbackStatus = ["pending", "approved", "rejected"] as const;

export const createFeedbackSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateFeedbackSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5").optional(),
  comment: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const feedbackStatusSchema = z.object({
  status: z.enum(feedbackStatus),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;
