export type DiscountType = "PERCENTAGE" | "FIXED";
export type VoucherType = "PUBLIC" | "SEASONAL";

export interface Voucher {
  _id: string;
  code: string;
  voucherType: VoucherType;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimitPerUser?: number;
  usageLimitTotal?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Vouchers" | "Active" | "Expired";
