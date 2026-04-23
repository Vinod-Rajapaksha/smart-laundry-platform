export const APP_NAME = "B & W Laundry";

export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
  PAYMENT: 'PAYMENT',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
