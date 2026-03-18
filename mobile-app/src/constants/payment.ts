export const PAYMENT_METHODS = {
  CARD: 'CARD',
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;

export type PaymentMethod =
  typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export type PaymentStatus =
  typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const BANK_VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type BankVerificationStatus =
  typeof BANK_VERIFICATION_STATUS[keyof typeof BANK_VERIFICATION_STATUS];