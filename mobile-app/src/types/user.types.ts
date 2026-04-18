export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  telephone: string;
  address?: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  telephone?: string;
  address?: string;
}
