export type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  telephone: string;
  address?: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  telephone: string;
  address?: string;
  password: string;
  role?: Role;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;
  password?: string;
}

export interface UserListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UserStats {
  ADMIN: number;
  STAFF: number;
  CUSTOMER: number;
}
