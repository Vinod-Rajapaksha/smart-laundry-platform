export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_TYPES = {
  WASH: 'WASH',
  DRY: 'DRY',
  IRON: 'IRON',
} as const;

export type OrderType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES];