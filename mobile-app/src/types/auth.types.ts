export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  telephone: string;
  address?: string;
  role: UserRole;
  isActive?: boolean;
  avatar?: string | null;
  avatarUrl?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  expectedRole?: UserRole;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
}