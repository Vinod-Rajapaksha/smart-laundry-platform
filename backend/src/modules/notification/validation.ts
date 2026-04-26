import { z } from 'zod';

export const validateNotificationId = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Notification ID'),
  }),
};
