export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  membership?: string;
  loyaltyPoints?: number;
  totalOrders?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProfileTab = "General" | "Security" | "Activity";
