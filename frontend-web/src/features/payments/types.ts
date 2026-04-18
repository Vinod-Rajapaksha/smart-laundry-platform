export type PaymentMethod = "CASH" | "ONLINE" | "BANK_TRANSFER" | "COD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "VERIFYING";

export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  provider?: string;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnlineTransaction {
  _id: string;
  createdAt: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  gatewayOrderId: string;
  gatewayPaymentId: string;
  rawResponse?: any;
  order?: {
    orderNo: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  payment?: {
    amount: number;
  };
}

export interface CODPayment {
  _id: string;
  createdAt: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  collectedAt?: string;
  notes?: string;
  order?: {
    orderNo: string;
  };
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  collector?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  payment?: {
    amount: number;
  };
}

export type Tab = "All" | "Pending" | "Paid" | "Failed";
