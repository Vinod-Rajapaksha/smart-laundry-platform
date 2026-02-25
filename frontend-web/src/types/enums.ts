// USER ROLES
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  CUSTOMER: "CUSTOMER",
} as const;

export type ROLES = (typeof ROLES)[keyof typeof ROLES];

// ADMIN PORTAL ROLES
export const ADMIN_PORTAL_ROLES: ROLES[] = ["ADMIN", "STAFF"];
