import { z } from "zod";

export const notificationTypes = ["ORDER_STATUS", "PROMOTION", "SYSTEM", "ALERT"] as const;

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.enum(notificationTypes),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  isRead: z.boolean(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
