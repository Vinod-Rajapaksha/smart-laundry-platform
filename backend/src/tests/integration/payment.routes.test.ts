process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";
process.env.NODE_ENV = "test";

import { jest } from "@jest/globals";

jest.mock("../../utils/cloudinary.js", () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue("https://cdn.example.com/slip.jpg" as never),
}));

jest.mock("../../utils/ocrService.js", () => ({
  processSlipOCR: jest.fn().mockResolvedValue({
    text: "SAMPLE BANK SLIP",
    confidence: 90,
    isMatch: true,
  } as never),
}));

import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../testHelpers.js";
import User from "../../database/models/User.js";
import Order from "../../database/models/Order.js";
import Payment from "../../database/models/Payment.js";
import BankTransfer from "../../database/models/BankTransfer.js";
import { hashPassword } from "../../utils/password.js";
import { generateAccessToken } from "../../utils/jwt.js";

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
    amount: 1500,
    method: "BANK_TRANSFER",
    status: "PENDING",
    transactionRef: `TXN-${Date.now()}`,
  });

  return { order, payment };
};

const createBankTransfer = async (
  paymentId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  return await BankTransfer.create({
    paymentId,
    userId,
    bankName: "Sampath Bank",
    referenceNo: "REF-001",
    slipImageUrl: "https://cdn.example.com/slip.jpg",
    systemRefId: `SYS-${Date.now()}`,
    verifyStatus: "PENDING",
    ocrStatus: "PENDING",
  });
};

describe("Payment Integration Tests - POST /api/payments/bank-transfer/submit", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

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

  it("should return 401 if not authenticated", async () => {
    const res = await request(app)
      .post("/api/payments/bank-transfer/submit")
      .attach("slipFile", Buffer.from("data"), { filename: "slip.jpg" });

    expect(res.status).toBe(401);
  });
});

describe("Payment Integration Tests - GET /api/payments/bank-transfer/pending", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  it("should return pending transfers list for admin", async () => {
    const { token } = await createUser("ADMIN");

    const res = await request(app)
      .get("/api/payments/bank-transfer/pending")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/payments/bank-transfer/pending");
    expect(res.status).toBe(401);
  });
});

describe("Payment Integration Tests - POST /api/payments/bank-transfer/:id/verify", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  it("should approve a transfer when admin provides valid status", async () => {
    const { user: customer } = await createUser("CUSTOMER");
    const { payment } = await createOrderWithPayment(customer._id as mongoose.Types.ObjectId);
    const transfer = await createBankTransfer(
      payment._id as mongoose.Types.ObjectId,
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
    const { payment } = await createOrderWithPayment(customer._id as mongoose.Types.ObjectId);
    const transfer = await createBankTransfer(
      payment._id as mongoose.Types.ObjectId,
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

  it("should return 400 if status is invalid (not APPROVED or REJECTED)", async () => {
    const { token: adminToken } = await createUser("ADMIN");
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/payments/bank-transfer/${fakeId}/verify`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PENDING" });

    expect(res.status).toBe(400);
  });

  it("should return 401 if not authenticated", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/payments/bank-transfer/${fakeId}/verify`)
      .send({ status: "APPROVED" });

    expect(res.status).toBe(401);
  });
});
