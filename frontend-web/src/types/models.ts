import type { ROLES } from "./enums";

export type ID = string;

// User
export interface User {
  id: ID;
  name?: string;
  email?: string;
  phone?: string;
  role?: ROLES;
}

// Rating
export interface Rating {
  id: ID;
  tokenId: ID;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}