import { z } from "zod";

export const bankTransferSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountName: z.string().min(1, "Account name is required"),
  referenceNo: z.string().min(1, "Transaction reference number is required"),
  amount: z.number().positive("Amount must be positive"),
  slipUrl: z.string().url("Payment slip image is required"),
});

export type BankTransferInput = z.infer<typeof bankTransferSchema>;
