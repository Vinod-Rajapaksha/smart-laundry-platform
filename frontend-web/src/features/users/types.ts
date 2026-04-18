export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";
export type StaffType = "DELIVERY" | "STORE" | "BOTH";

export interface User {
  _id: string;
  name: string;
  email: string;
  telephone: string;
  address?: string;
  role: UserRole;
  salary?: number;
  staffType?: StaffType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Users" | "Admin" | "Staff" | "Customer";
