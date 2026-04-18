import { jest } from "@jest/globals";

jest.mock("../../../database/models/BankTransfer.js", () => ({
  default: { create: jest.fn(), findById: jest.fn() },
}));
jest.mock("../../../database/models/Order.js", () => ({
  default: { findById: jest.fn(), findOne: jest.fn() },
}));
jest.mock("../../../database/models/Payment.js", () => ({
  default: { findOne: jest.fn(), findById: jest.fn() },
}));
jest.mock("../../../utils/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn(),
}));
jest.mock("../../../utils/ocrService.js", () => ({
  processSlipOCR: jest.fn(),
}));

import BankTransfer from "../../../src/database/models/BankTransfer.js";
import Order from "../../../src/database/models/Order.js";
import Payment from "../../../src//database/models/Payment.js";
import { uploadToCloudinary } from "../../../src//utils/cloudinary.js";
import { processSlipOCR } from "../../../src/utils/ocrService.js";
import { submitBankTransfer, verifyTransfer } from "../../../src/modules/payment/service/bankTransfer.service.js";

const mockBankTransfer = BankTransfer as jest.Mocked<typeof BankTransfer>;
const mockOrder = Order as jest.Mocked<typeof Order>;
const mockPayment = Payment as jest.Mocked<typeof Payment>;
const mockUpload = uploadToCloudinary as jest.MockedFunction<typeof uploadToCloudinary>;
const mockOCR = processSlipOCR as jest.MockedFunction<typeof processSlipOCR>;

const makeOrder = (overrides = {}) => ({
  _id: "order123",
  orderNo: "ORD-001",
  status: "CREATED",
  paymentMethod: null as string | null,
  paymentStatus: "PENDING",
  save: jest.fn().mockResolvedValue(undefined as never),
  ...overrides,
});

const makePayment = (overrides = {}) => ({
  _id: "payment123",
  orderId: "order123",
  method: "BANK_TRANSFER",
  status: "PENDING",
  transactionRef: "TXN-001",
  paidAt: null as Date | null,
  save: jest.fn().mockResolvedValue(undefined as never),
  ...overrides,
});

const makeTransfer = (overrides = {}) => ({
  _id: "transfer123",
  paymentId: "payment123",
  verifyStatus: "PENDING",
  ocrStatus: "PENDING",
  systemRefId: "TXN-001",
  isSuspicious: false,
  internalNotes: undefined as string | undefined,
  rejectReason: undefined as string | undefined,
  save: jest.fn().mockResolvedValue(undefined as never),
  ...overrides,
});

const makeFile = (): Express.Multer.File =>
  ({
    buffer: Buffer.from("test"),
    mimetype: "image/jpeg",
    fieldname: "slipFile",
    originalname: "slip.jpg",
    encoding: "7bit",
    size: 100,
  } as Express.Multer.File);

describe("Payment Service - submitBankTransfer()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should submit a bank transfer and run OCR", async () => {
    const order = makeOrder();
    const payment = makePayment();
    const transfer = makeTransfer();

    (mockOrder.findById as jest.MockedFunction<any>).mockResolvedValueOnce(order);
    (mockPayment.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(payment);
    (mockUpload as jest.MockedFunction<any>).mockResolvedValueOnce("https://cdn.example.com/slip.jpg");
    (mockBankTransfer.create as jest.MockedFunction<any>).mockResolvedValueOnce(transfer);
    (mockOCR as jest.MockedFunction<any>).mockResolvedValueOnce({
      text: "BANK SLIP",
      confidence: 95,
      isMatch: true,
    });

    const result = await submitBankTransfer(
      "user123",
      "order123",
      "Sampath Bank",
      "REF-001",
      makeFile()
    );

    expect(mockUpload).toHaveBeenCalled();
    expect(mockOCR).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(order.paymentMethod).toBe("BANK_TRANSFER");
  });

  it("should throw 404 if order is not found", async () => {
    (mockOrder.findById as jest.MockedFunction<any>).mockResolvedValueOnce(null);
    (mockOrder.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    await expect(
      submitBankTransfer("user123", "nonexistent", "Bank", "REF", makeFile())
    ).rejects.toMatchObject({ statusCode: 404, message: "Order not found" });
  });

  it("should throw 404 if payment record not found for order", async () => {
    (mockOrder.findById as jest.MockedFunction<any>).mockResolvedValueOnce(makeOrder());
    (mockPayment.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    await expect(
      submitBankTransfer("user123", "order123", "Bank", "REF", makeFile())
    ).rejects.toMatchObject({ statusCode: 404, message: "Payment not initiated for this order" });
  });
});

describe("Payment Service - verifyTransfer()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should approve a transfer and mark payment as PAID", async () => {
    const transfer = makeTransfer({ paymentId: makePayment() });
    const payment = makePayment();
    const order = makeOrder();

    (mockBankTransfer.findById as jest.MockedFunction<any>).mockReturnValueOnce({
      populate: jest.fn<any>().mockResolvedValueOnce(transfer),
    });
    (mockPayment.findById as jest.MockedFunction<any>).mockResolvedValueOnce(payment);
    (mockOrder.findById as jest.MockedFunction<any>).mockResolvedValueOnce(order);

    const result = await verifyTransfer(
      "transfer123",
      "admin123",
      "APPROVED",
      false,
      "Looks correct",
      undefined
    );

    expect(transfer.verifyStatus).toBe("APPROVED");
    expect(payment.status).toBe("PAID");
    expect(result).toBeDefined();
  });

  it("should reject a transfer and mark payment as FAILED", async () => {
    const transfer = makeTransfer({ paymentId: makePayment() });
    const payment = makePayment();
    const order = makeOrder();

    (mockBankTransfer.findById as jest.MockedFunction<any>).mockReturnValueOnce({
      populate: jest.fn<any>().mockResolvedValueOnce(transfer),
    });
    (mockPayment.findById as jest.MockedFunction<any>).mockResolvedValueOnce(payment);
    (mockOrder.findById as jest.MockedFunction<any>).mockResolvedValueOnce(order);

    await verifyTransfer("transfer123", "admin123", "REJECTED", true, undefined, "Fake slip");

    expect(transfer.verifyStatus).toBe("REJECTED");
    expect(payment.status).toBe("FAILED");
  });

  it("should throw 404 if transfer not found", async () => {
    (mockBankTransfer.findById as jest.MockedFunction<any>).mockReturnValueOnce({
      populate: jest.fn<any>().mockResolvedValueOnce(null),
    });

    await expect(
      verifyTransfer("bad_id", "admin123", "APPROVED", false)
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
