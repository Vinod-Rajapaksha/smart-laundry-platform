export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PICKUP_ASSIGNED: 'PICKUP_ASSIGNED', //
  PICKUP_ENROUTE: 'PICKUP_ENROUTE', //
  PICKED_UP: 'PICKED_UP', //
  READY: 'READY', // 
  DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED', //
  DELIVERY_ENROUTE: 'DELIVERY_ENROUTE', //
  DELIVERED: 'DELIVERED',   //
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

export const JOB_TYPE = {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY',
} as const;

export type JobType = typeof JOB_TYPE[keyof typeof JOB_TYPE];

export const JOB_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];