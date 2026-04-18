export interface LoyaltyTier {
  _id: string;
  name: string;
  minPoints: number;
  discountPercent: number;
  perks: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  _id: string;
  userId: string;
  tierId: string | LoyaltyTier;
  points: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "Customers" | "Tiers" | "Transactions";
