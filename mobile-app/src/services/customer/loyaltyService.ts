import api from '../api';

export interface LoyaltyStatus {
  points: number;
  totalSpent: number;
  tierId: {
    _id: string;
    name: string;
    discountPercent: number;
    perks: string[];
    minPoints: number;
  };
}

export interface LoyaltyTransaction {
  _id: string;
  type: string;
  points: number;
  description?: string;
  createdAt: string;
}

export interface LoyaltyTier {
  _id: string;
  name: string;
  minPoints: number;
  discountPercent: number;
  perks: string[];
}

export const loyaltyService = {
  getStatus: async (): Promise<LoyaltyStatus | null> => {
    const response = await api.get('/loyalty/status');
    return response.data.data;
  },

  getHistory: async (): Promise<LoyaltyTransaction[]> => {
    const response = await api.get('/loyalty/history');
    return response.data.data || [];
  },

  getTiers: async (): Promise<LoyaltyTier[]> => {
    const response = await api.get('/loyalty/tiers');
    return response.data.data || [];
  }
};
