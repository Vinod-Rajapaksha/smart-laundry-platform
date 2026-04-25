process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import Order from "../../database/models/Order.js";

describe("Feedback Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("POST /api/feedback", () => {
    it("should create feedback for a delivered order", async () => {
      const { user, token } = await createTestUser("CUSTOMER");
      const order = await Order.create({
        orderNo: "ORD-F1",
        userId: user._id,
        serviceId: new mongoose.Types.ObjectId(),
        totalAmount: 100,
        status: "DELIVERED",
        paymentMethod: "NONE",
        paymentStatus: "PAID"
      });

      const res = await request(app)
        .post("/api/feedback")
        .set(getAuthHeader(token))
        .send({
          orderId: order._id.toString(),
          rating: 5,
          comment: "Great service!"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.rating).toBe(5);
    });

    it("should return 400 if order is not delivered", async () => {
      const { user, token } = await createTestUser("CUSTOMER");
      const order = await Order.create({
        orderNo: "ORD-F2",
        userId: user._id,
        serviceId: new mongoose.Types.ObjectId(),
        totalAmount: 100,
        status: "ORDER_PLACED",
        paymentMethod: "NONE",
        paymentStatus: "PENDING"
      });

      const res = await request(app)
        .post("/api/feedback")
        .set(getAuthHeader(token))
        .send({ orderId: order._id.toString(), rating: 5 });

      expect(res.status).toBe(400);
    });
  });
});
