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

// MACHINE CONSTANTS
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

// STOCK & INVENTORY
export const STOCK_MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

export const SUPPLIER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
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
