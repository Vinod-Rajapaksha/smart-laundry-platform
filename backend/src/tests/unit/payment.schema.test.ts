import { initPaymentSchema, submitBankTransferSchema, verifyTransferSchema } from "../../validation/payment.schema.js";

describe("Payment Zod Schema - initPaymentSchema", () => {
  it("should pass with valid orderId and method", () => {
    expect(
      initPaymentSchema.safeParse({ orderId: "order123", method: "BANK_TRANSFER" }).success
    ).toBe(true);
  });

  it("should fail with an invalid payment method", () => {
    expect(
      initPaymentSchema.safeParse({ orderId: "order123", method: "CRYPTO" }).success
    ).toBe(false);
  });

  it("should fail if orderId is empty", () => {
    expect(
      initPaymentSchema.safeParse({ orderId: "", method: "COD" }).success
    ).toBe(false);
  });
});

describe("Payment Zod Schema - submitBankTransferSchema", () => {
  const valid = {
    orderId: "order123",
    bankName: "Sampath Bank",
    referenceNo: "REF-001",
  };

  it("should pass with all required fields", () => {
    expect(submitBankTransferSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail if bankName is empty", () => {
    expect(submitBankTransferSchema.safeParse({ ...valid, bankName: "" }).success).toBe(false);
  });

  it("should fail if referenceNo is empty", () => {
    expect(submitBankTransferSchema.safeParse({ ...valid, referenceNo: "" }).success).toBe(false);
  });

  it("should fail if orderId is missing", () => {
    expect(
      submitBankTransferSchema.safeParse({ bankName: "Sampath", referenceNo: "REF" }).success
    ).toBe(false);
  });
});

describe("Payment Zod Schema - verifyTransferSchema", () => {
  it("should pass with APPROVED status", () => {
    expect(verifyTransferSchema.safeParse({ status: "APPROVED" }).success).toBe(true);
  });

  it("should pass with REJECTED status and optional fields", () => {
    expect(
      verifyTransferSchema.safeParse({
        status: "REJECTED",
        isSuspicious: true,
        rejectReason: "Fake slip",
      }).success
    ).toBe(true);
  });

  it("should fail with an invalid status", () => {
    expect(verifyTransferSchema.safeParse({ status: "PENDING" }).success).toBe(false);
  });

  it("should fail if status is missing", () => {
    expect(verifyTransferSchema.safeParse({}).success).toBe(false);
  });
});
