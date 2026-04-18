export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Voucher {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Vouchers" | "Active" | "Expired";
