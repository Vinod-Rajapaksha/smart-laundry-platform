import {
  validateCreateVoucher,
  validateVoucherCode,
  validateApplyVoucher,
  validateApplyToOrder,
  validateRedeemVoucher,
} from "../../modules/voucher/validation.js";

describe("Voucher Zod Schema - validateCreateVoucher", () => {
  const valid = {
    code: "SAVE10",
    voucherType: "GENERAL",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 100,
    maxDiscount: 200,
    usageLimitPerUser: 1,
    usageLimitTotal: 10,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000).toISOString(),
  };

  it("should pass with valid data", () => {
    expect(validateCreateVoucher.body.safeParse(valid).success).toBe(true);
  });

  it("should fail if code is empty", () => {
    const result = validateCreateVoucher.body.safeParse({ ...valid, code: "" });
    expect(result.success).toBe(false);
  });

  it("should fail if discountType is invalid", () => {
    const result = validateCreateVoucher.body.safeParse({
      ...valid,
      discountType: "WRONG",
    });
    expect(result.success).toBe(false);
  });

  it("should fail if discountValue is negative", () => {
    const result = validateCreateVoucher.body.safeParse({
      ...valid,
      discountValue: -10,
    });
    expect(result.success).toBe(false);
  });

  it("should fail if startDate is not datetime", () => {
    const result = validateCreateVoucher.body.safeParse({
      ...valid,
      startDate: "bad-date",
    });
    expect(result.success).toBe(false);
  });
});

describe("Voucher Zod Schema - validateVoucherCode", () => {
  it("should pass with valid code", () => {
    expect(validateVoucherCode.params.safeParse({ code: "SAVE10" }).success).toBe(true);
  });

  it("should fail with empty code", () => {
    expect(validateVoucherCode.params.safeParse({ code: "" }).success).toBe(false);
  });
});

describe("Voucher Zod Schema - validateApplyVoucher", () => {
  it("should pass with valid data", () => {
    expect(
      validateApplyVoucher.body.safeParse({
        code: "SAVE10",
        orderAmount: 1000,
      }).success,
    ).toBe(true);
  });

  it("should fail if orderAmount is negative", () => {
    expect(
      validateApplyVoucher.body.safeParse({
        code: "SAVE10",
        orderAmount: -1,
      }).success,
    ).toBe(false);
  });
});

describe("Voucher Zod Schema - validateApplyToOrder", () => {
  it("should pass with valid data", () => {
    expect(
      validateApplyToOrder.body.safeParse({
        orderId: "507f1f77bcf86cd799439011",
        voucherCode: "SAVE10",
      }).success,
    ).toBe(true);
  });

  it("should fail with invalid orderId", () => {
    expect(
      validateApplyToOrder.body.safeParse({
        orderId: "bad-id",
        voucherCode: "SAVE10",
      }).success,
    ).toBe(false);
  });
});

describe("Voucher Zod Schema - validateRedeemVoucher", () => {
  it("should pass with valid ids", () => {
    expect(
      validateRedeemVoucher.body.safeParse({
        voucherId: "507f1f77bcf86cd799439011",
        orderId: "507f1f77bcf86cd799439012",
      }).success,
    ).toBe(true);
  });

  it("should fail with invalid voucherId", () => {
    expect(
      validateRedeemVoucher.body.safeParse({
        voucherId: "bad-id",
        orderId: "507f1f77bcf86cd799439012",
      }).success,
    ).toBe(false);
  });
});