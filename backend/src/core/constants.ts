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

// FEEDBACK STATUS
export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const FEEDBACK_TAGS = {
  GOOD_SERVICE: 'good service',
  EXCELLENT_CUSTOMER_SERVICE: 'excellent customer service',
  ON_TIME: 'on time',
  REASONABLE_PRICES: 'reasonable prices',
  RECOMMENDED: 'recommended',
};

// DEFAULT PAGINATION
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

// SORT ORDER
export const SORT_ORDER = {
  ASC: 1,
  DESC: -1,
} as const;

// COMMON MESSAGES
export const MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
} as const;
