import { apiFetch } from "../../../services/http/interceptors";

export type BankTransferStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PendingTransferData {
  _id: string;
  paymentId: {
    _id: string;
    orderId: {
      _id: string;
      orderNo: string;
      totalAmount: number;
      tokenNumber?: string;
      weightKg?: number;
      status: string;
      reservedDateTime?: string;
      notes?: string;
      pickupAddress?: string;
      deliveryAddress?: string;
      serviceId?: {
        name: string;
        category: string;
      };
    };
    amount: number;
    status: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  bankName: string;
  referenceNo: string;
  slipImageUrl: string;
  systemRefId: string;
  verifyStatus: BankTransferStatus;
  ocrText?: string;
  ocrConfidence?: number;
  ocrStatus?: 'MATCHED' | 'MISMATCHED' | 'FAILED' | 'PENDING';
  isSuspicious: boolean;
  internalNotes?: string;
  rejectReason?: string;
  createdAt: string;
}

export const bankVerificationApi = {
  getTransfers: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    
    return apiFetch<{ data: PendingTransferData[] }>(`/payments/bank-transfer?${query.toString()}`);
  },

  verifyTransfer: (transferId: string, payload: {
    status: "APPROVED" | "REJECTED";
    isSuspicious: boolean;
    internalNotes?: string;
    rejectReason?: string;
  }) => 
    apiFetch(`/payments/bank-transfer/${transferId}/verify`, {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
