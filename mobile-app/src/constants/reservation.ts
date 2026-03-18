export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type ReservationStatus =
  typeof RESERVATION_STATUS[keyof typeof RESERVATION_STATUS];

export const TIME_SLOTS = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  EVENING: 'EVENING',
} as const;

export type TimeSlot =
  typeof TIME_SLOTS[keyof typeof TIME_SLOTS];