// USER ROLES
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type ROLES = (typeof ROLES)[keyof typeof ROLES];

// ADMIN PORTAL ROLES
export const ADMIN_PORTAL_ROLES: ROLES[] = ["ADMIN", "STAFF"];

// FEEDBACK STATUS
export const FEEDBACK_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUS)[keyof typeof FEEDBACK_STATUS];