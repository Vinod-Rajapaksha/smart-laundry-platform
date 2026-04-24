import { apiFetch } from "../../../services/http/interceptors";
import type { CustomerLoyalty, LoyaltyTier, LoyaltyTransaction } from "../types";

export const getLoyaltyTiers = async () => {
  return apiFetch<LoyaltyTier[]>(`/loyalty/tiers`);
};

export const getCustomerLoyalty = async () => {
  return apiFetch<CustomerLoyalty[]>(`/loyalty/customers`);
};

export const getAllTransactions = async () => {
  return apiFetch<LoyaltyTransaction[]>(`/loyalty/transactions`);
};

export const updateLoyaltyTier = async (id: string, data: Partial<LoyaltyTier>) => {
  return apiFetch<LoyaltyTier>(`/loyalty/tiers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
