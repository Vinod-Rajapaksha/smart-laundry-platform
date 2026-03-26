// USER ROLES
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

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


