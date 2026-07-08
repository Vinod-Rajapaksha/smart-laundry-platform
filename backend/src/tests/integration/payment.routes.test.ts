import { jest } from "@jest/globals";

jest.unstable_mockModule("../../core/expo.js", () => ({
  sendPushNotification: jest.fn(() => Promise.resolve()),
  default: {
    chunkPushNotifications: jest.fn(() => []),
    sendPushNotificationsAsync: jest.fn(() => Promise.resolve([])),
  }
}));

jest.unstable_mockModule("../../utils/ocrService.js", () => ({
  processSlipOCR: jest.fn(() => Promise.resolve({
    text: "SAMPLE BANK SLIP",
    confidence: 90,
    isMatch: true,
    extractedAmount: 1500,
    extractedDate: "2024-01-01",
    extractedRef: "REF-001",
    extractedBank: "Sampath Bank",
    extractedAccount: "12345678"
  })),
}));

jest.unstable_mockModule("../../utils/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn(() => Promise.resolve("https://cdn.example.com/slip.jpg")),
}));

import mongoose from "mongoose";

let request: any;
let app: any;
let testHelpers: any;
let User: any;
let Order: any;
let Payment: any;
let BankTransfer: any;
let hashPassword: any;
let generateAccessToken: any;

jest.setTimeout(30000);

const createUser = async (role = "CUSTOMER") => {
  const hashed = await hashPassword("Test@1234");
  const user = await User.create({
    name: "Test User",
    email: `user_${Date.now()}@example.com`,
    telephone: "0771234567",
    password: hashed,
    role,
    isActive: true,
  });
  const token = generateAccessToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

const createOrderWithPayment = async (userId: mongoose.Types.ObjectId) => {
  const serviceId = new mongoose.Types.ObjectId();
  const order = await Order.create({
    orderNo: `ORD-${Date.now()}`,
    userId,
    serviceId,
    status: "CREATED",
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PENDING",
  });

  const payment = await Payment.create({
    orderId: order._id,
    userId,
    amount: 1500,
    method: "BANK_TRANSFER",
    status: "PENDING",
    transactionRef: `TXN-${Date.now()}`,
  });

  return { order, payment };
};

const createBankTransfer = async (
  paymentId: mongoose.Types.ObjectId,
  orderId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  return await BankTransfer.create({
    paymentId,
    orderId,
    userId,
    bankName: "Sampath Bank",
    referenceNo: "REF-001",
    slipImageUrl: "https://cdn.example.com/slip.jpg",
    systemRefId: `SYS-${Date.now()}`,
    verifyStatus: "PENDING",
    ocrStatus: "PENDING",
  });
};

describe("Payment Integration Tests", () => {
  beforeAll(async () => {
    jest.setTimeout(60000);

    request = (await import("supertest")).default;
    const appModule = await import("../../app.js");
    app = appModule.default;
    testHelpers = await import("../testHelpers.js");
    User = (await import("../../database/models/User.js")).default;
    Order = (await import("../../database/models/Order.js")).default;
    Payment = (await import("../../database/models/Payment.js")).default;
    BankTransfer = (await import("../../database/models/BankTransfer.js")).default;
    hashPassword = (await import("../../utils/password.js")).hashPassword;
    generateAccessToken = (await import("../../utils/jwt.js")).generateAccessToken;

    await testHelpers.connectTestDB();
  });

  afterAll(async () => {
    if (testHelpers) await testHelpers.disconnectTestDB();
  });

  afterEach(async () => {
    if (testHelpers) await testHelpers.clearTestDB();
  });

  describe("POST /api/payments/bank-transfer/submit", () => {
    it("should submit a bank transfer slip successfully", async () => {
      const { user, token } = await createUser("CUSTOMER");
      const { order } = await createOrderWithPayment(user._id as mongoose.Types.ObjectId);

      const res = await request(app)
        .post("/api/payments/bank-transfer/submit")
        .set("Authorization", `Bearer ${token}`)
        .field("orderId", order._id.toString())
        .field("bankName", "Sampath Bank")
        .field("referenceNo", "REF-001")
        .attach("slipFile", Buffer.from("fake-image-data"), {
          filename: "slip.jpg",
          contentType: "image/jpeg",
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("slipImageUrl");
      expect(res.body.data.bankName).toBe("Sampath Bank");
    });

    it("should return 400 if required fields are missing", async () => {
      const { token } = await createUser("CUSTOMER");

      const res = await request(app)
        .post("/api/payments/bank-transfer/submit")
        .set("Authorization", `Bearer ${token}`)
        .field("bankName", "Sampath Bank")
        .attach("slipFile", Buffer.from("fake-image-data"), {
          filename: "slip.jpg",
          contentType: "image/jpeg",
        });

      expect(res.status).toBe(400);
    });

    it("should return 400 if slip file is not attached", async () => {
      const { user, token } = await createUser("CUSTOMER");
      const { order } = await createOrderWithPayment(user._id as mongoose.Types.ObjectId);

      const res = await request(app)
        .post("/api/payments/bank-transfer/submit")
        .set("Authorization", `Bearer ${token}`)
        .send({
          orderId: order._id.toString(),
          bankName: "Sampath Bank",
          referenceNo: "REF-001",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/payments/bank-transfer", () => {
    it("should return transfers list for admin", async () => {
      const { token } = await createUser("ADMIN");

      const res = await request(app)
        .get("/api/payments/bank-transfer")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe("POST /api/payments/bank-transfer/:id/verify", () => {
    it("should approve a transfer when admin provides valid status", async () => {
      const { user: customer } = await createUser("CUSTOMER");
      const { order, payment } = await createOrderWithPayment(customer._id as mongoose.Types.ObjectId);
      const transfer = await createBankTransfer(
        payment._id as mongoose.Types.ObjectId,
        order._id as mongoose.Types.ObjectId,
        customer._id as mongoose.Types.ObjectId
      );

      const { token: adminToken } = await createUser("ADMIN");

      const res = await request(app)
        .post(`/api/payments/bank-transfer/${transfer._id}/verify`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "APPROVED", isSuspicious: false, internalNotes: "All good" });

      expect(res.status).toBe(200);
      expect(res.body.data.verifyStatus).toBe("APPROVED");
    });

    it("should reject a transfer with a reason", async () => {
      const { user: customer } = await createUser("CUSTOMER");
      const { order, payment } = await createOrderWithPayment(customer._id as mongoose.Types.ObjectId);
      const transfer = await createBankTransfer(
        payment._id as mongoose.Types.ObjectId,
        order._id as mongoose.Types.ObjectId,
        customer._id as mongoose.Types.ObjectId
      );

      const { token: adminToken } = await createUser("ADMIN");

      const res = await request(app)
        .post(`/api/payments/bank-transfer/${transfer._id}/verify`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "REJECTED", isSuspicious: true, rejectReason: "Unreadable slip" });

      expect(res.status).toBe(200);
      expect(res.body.data.verifyStatus).toBe("REJECTED");
    });
  });

  describe("COD & Online", () => {
    it("should confirm a COD payment", async () => {
      const { user, token } = await createUser("CUSTOMER");
      const serviceId = new mongoose.Types.ObjectId();
      const order = await Order.create({
        orderNo: "ORD-COD",
        userId: user._id,
        serviceId,
        status: "CREATED",
        paymentMethod: "COD",
        paymentStatus: "PENDING"
      });

      await Payment.create({
        orderId: order._id,
        userId: user._id,
        amount: 1500,
        method: "COD",
        status: "PENDING",
        transactionRef: order.orderNo
      });

      const res = await request(app)
        .post("/api/payments/cod/confirm")
        .set("Authorization", `Bearer ${token}`)
        .send({ orderId: order.orderNo });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should generate PayHere hash for online transaction", async () => {
      const { user, token } = await createUser("CUSTOMER");
      const serviceId = new mongoose.Types.ObjectId();
      const order = await Order.create({
        orderNo: "ORD-ONLINE",
        userId: user._id,
        serviceId,
        status: "CREATED",
        totalAmount: 1500,
        paymentMethod: "CARD",
        paymentStatus: "PENDING"
      });

      const res = await request(app)
        .get(`/api/payments/online/payhere/hash/${order.orderNo}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("hash");
    });
  });
});
