import { z } from "zod";

export const paymentMethods = ["CARD", "COD", "BANK_TRANSFER"] as const;
export const paymentStatus = ["PENDING", "PAID", "FAILED"] as const;

export const initPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  method: z.enum(paymentMethods),
});

export const submitBankTransferSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  bankName: z.string().min(1, "Bank name is required"),
  referenceNo: z.string().min(1, "Reference number is required"),
});

export const verifyTransferSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  isSuspicious: z.boolean().optional(),
  internalNotes: z.string().optional(),
  rejectReason: z.string().optional(),
});

export const confirmBankTransferSchema = z.object({
  transactionRef: z.string().min(1, "Transaction reference is required"),
  bankSlipUrl: z.string().url("Valid bank slip URL is required").optional(),
});

export type InitPaymentInput = z.infer<typeof initPaymentSchema>;
export type ConfirmBankTransferInput = z.infer<typeof confirmBankTransferSchema>;
export type SubmitBankTransferInput = z.infer<typeof submitBankTransferSchema>;
export type VerifyTransferInput = z.infer<typeof verifyTransferSchema>;
