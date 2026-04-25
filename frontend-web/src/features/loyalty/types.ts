export interface LoyaltyTier {
  _id: string;
  name: string;
  minPoints: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  perks: string[];
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    loyaltyPoints: number;
    membership: {
      level: string;
      validUntil: string | null;
    };
  };
  tierId: LoyaltyTier;
  points: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "Customers" | "Tiers" | "Transactions";

export interface LoyaltyTransaction {
  _id: string;
  loyaltyId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  type: string;
  points: number;
  description: string;
  createdAt: string;
}
