export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];