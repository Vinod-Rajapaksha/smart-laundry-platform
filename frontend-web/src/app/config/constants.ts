// Application Constants
export const APP_NAME = "B & W Laundry";

// USER ROLES
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  NONE: 'NONE',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Bank Verification Status
export const BANK_VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type BankVerificationStatus = typeof BANK_VERIFICATION_STATUS[keyof typeof BANK_VERIFICATION_STATUS];

// ORDER STATUS
export const ORDER_STATUS = {
  ORDER_PLACED: 'ORDER_PLACED',
  PICKUP_ASSIGNED: 'PICKUP_ASSIGNED',
  PICKUP_ON_THE_WAY: 'PICKUP_ON_THE_WAY',
  PICKUP_ARRIVED: 'PICKUP_ARRIVED',
  PICKED_UP: 'PICKED_UP',
  HANDED_OVER: 'HANDED_OVER',
  WASHING: 'WASHING',
  DRYING: 'DRYING',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED',
  DELIVERY_ON_THE_WAY: 'DELIVERY_ON_THE_WAY',
  DELIVERY_ARRIVED: 'DELIVERY_ARRIVED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// NOTIFICATION TYPES
export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'ORDER_UPDATE',
  PROMOTION: 'PROMOTION',
  SYSTEM: 'SYSTEM',
  PAYMENT: 'PAYMENT',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// VOUCHER & DISCOUNTS
export const VOUCHER_TYPE = {
  PUBLIC: "PUBLIC",
  SEASONAL: "SEASONAL",
} as const;

export const DISCOUNT_TYPE = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;

// UNITS OF MEASURE
export const UNITS = {
  KG: 'KG',
  PCS: 'PCS',
  SET: 'SET',
  L: 'L',
  ML: 'ML',
} as const;

export type Unit = typeof UNITS[keyof typeof UNITS];

// STAFF TYPES
export const STAFF_TYPES = {
  DELIVERY: 'DELIVERY',
  STORE: 'STORE',
  BOTH: 'BOTH',
} as const;

export type StaffType = typeof STAFF_TYPES[keyof typeof STAFF_TYPES];

// LOYALTY TIER
export const LOYALTY_TIER_NAME = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  PLATINUM: "PLATINUM",
  GOLD: "GOLD",
} as const;

// LOGISTICS & JOBS
export const LOGISTICS_JOB_TYPES = {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY',
} as const;

export const LOGISTICS_JOB_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const MACHINE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  MAINTENANCE: 'MAINTENANCE',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
} as const;

export const MACHINE_TYPES = {
  WASHER: 'WASHER',
  DRYER: 'DRYER',
} as const;

export const STOCK_MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

export const SUPPLIER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export const PAYMENT_PROVIDERS = {
  BANK: 'BANK',
  COD: 'COD',
  PAYHERE: 'PAYHERE',
} as const;

// FEEDBACK STATUS
export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// LOYALTY TRANSACTION
export const LOYALTY_TRANSACTION_TYPES = {
  EARNED: 'EARNED',
  REDEEMED: 'REDEEMED',
  ADJUSTED: 'ADJUSTED',
} as const;

// ANALYTICS
export const ANALYTICS_DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  OVERALL: 'overall',
} as const;

export const ANALYTICS_GROUP_BY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;
