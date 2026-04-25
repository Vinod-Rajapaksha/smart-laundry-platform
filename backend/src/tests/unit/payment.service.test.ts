import { jest } from "@jest/globals";
import mongoose from "mongoose";
import BankTransfer from "../../database/models/BankTransfer.js";
import Order from "../../database/models/Order.js";
import Payment from "../../database/models/Payment.js";
import User from "../../database/models/User.js";
import Service from "../../database/models/Service.js";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../testHelpers.js";
import { submitBankTransfer, verifyTransfer } from "../../modules/payment/service/bankTransfer.service.js";

jest.mock("../../modules/notification/service.js", () => ({
  createNotification: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../modules/loyalty/loyalty.service.js", () => ({
  awardLoyaltyPoints: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../utils/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn(() => Promise.resolve("https://cdn.example.com/slip.jpg")),
}));

jest.mock("../../utils/ocrService.js", () => ({
  processSlipOCR: jest.fn(() => Promise.resolve({
    text: "BANK SLIP",
    confidence: 95,
    isMatch: true,
  })),
}));

describe("Bank Transfer Payment Service", () => {
  let userId: string;
  let orderId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    const user = await User.create({
      name: "Customer",
      email: "c@example.com",
      password: "password123",
      telephone: "0771234567"
    });
    userId = user._id.toString();

    const service = await Service.create({
      name: "Wash",
      price: 100,
      categoryId: new mongoose.Types.ObjectId().toString()
    });

    const order = await Order.create({
      orderNo: "ORD-001",
      userId,
      serviceId: service._id,
      totalAmount: 100,
      paymentMethod: "NONE",
      paymentStatus: "PENDING",
      status: "ORDER_PLACED"
    });
    orderId = order._id.toString();

    await Payment.create({
      orderId,
      userId,
      amount: 100,
      method: "BANK_TRANSFER",
      status: "PENDING",
      transactionRef: `TXN-${Date.now()}`
    });
  });

  const makeFile = (): any => ({
    buffer: Buffer.from("test"),
    mimetype: "image/jpeg",
    originalname: "slip.jpg",
    fieldname: "slipFile",
  });

  describe("submitBankTransfer()", () => {
    it("should submit a bank transfer successfully", async () => {
      const result = await submitBankTransfer(
        userId,
        orderId,
        "Sampath Bank",
        `SYS-${Date.now()}`,
        "1234567890",
        makeFile(),
      );

      expect(result).toBeDefined();
      const transfer = await BankTransfer.findOne({ orderId });
      expect(transfer).toBeDefined();
      expect(transfer?.bankName).toBe("Sampath Bank");

      const order = await Order.findById(orderId);
      expect(order?.paymentMethod).toBe("BANK_TRANSFER");
    });
  });

  describe("verifyTransfer()", () => {
    it("should approve a transfer and mark payment as PAID", async () => {
      const payment = await Payment.findOne({ orderId });
      const transfer = await BankTransfer.create({
        orderId,
        userId,
        paymentId: payment?._id,
        bankName: "Bank",
        referenceNo: "REF",
        systemRefId: "SYS-REF",
        slipImageUrl: "http://example.com/slip.jpg",
        verifyStatus: "PENDING"
      });

      const result = await verifyTransfer(
        transfer._id.toString(),
        new mongoose.Types.ObjectId().toString(),
        "APPROVED",
        false,
        "Looks correct"
      );

      expect(result.verifyStatus).toBe("APPROVED");
      const updatedPayment = await Payment.findById(payment?._id);
      expect(updatedPayment?.status).toBe("PAID");
    });
  });
});
