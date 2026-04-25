import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const notificationIdParamSchema = z.object({
  id: objectIdSchema,
});

export type NotificationIdParamInput = z.infer<typeof notificationIdParamSchema>;
