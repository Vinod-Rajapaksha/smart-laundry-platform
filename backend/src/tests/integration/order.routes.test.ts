process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import Service from "../../database/models/Service.js";
import Inventory from "../../database/models/Inventory.js";
import Order from "../../database/models/Order.js";

describe("Order Integration Tests", () => {
  let serviceId: string;
  let inventoryId: string;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => { await disconnectTestDB(); });

  beforeEach(async () => {
    await clearTestDB();
    const service = await Service.create({
      name: "Wash & Fold",
      price: 150,
      categoryId: new mongoose.Types.ObjectId().toString()
    });
    serviceId = service._id.toString();

    const inventory = await Inventory.create({
      name: "Detergent",
      categoryName: "Supplies",
      unit: "KG",
      unitPrice: 10,
      qtyInStock: 100,
      supplierId: new mongoose.Types.ObjectId().toString()
    });
    inventoryId = inventory._id.toString();
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      const { token } = await createTestUser("CUSTOMER");
      const res = await request(app)
        .post("/api/orders")
        .set(getAuthHeader(token))
        .send({
          serviceId,
          weightKg: 2,
          paymentMethod: "COD",
          pickupAddress: "123 Main St",
          deliveryAddress: "456 Side St"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.orderNo).toBeDefined();
    });

    it("should return 400 for invalid data", async () => {
      const { token } = await createTestUser("CUSTOMER");
      const res = await request(app)
        .post("/api/orders")
        .set(getAuthHeader(token))
        .send({ serviceId: "invalid-id" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders/my", () => {
    it("should list current customer orders", async () => {
      const { user, token } = await createTestUser("CUSTOMER");
      await Order.create({
        orderNo: "ORD-001",
        userId: user._id,
        serviceId,
        totalAmount: 150,
        status: "ORDER_PLACED",
        paymentMethod: "NONE",
        paymentStatus: "PENDING"
      });

      const res = await request(app)
        .get("/api/orders/my")
        .set(getAuthHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.orders.length).toBe(1);
    });
  });

  describe("PATCH /api/orders/:id/status (Admin/Staff)", () => {
    it("should update order status", async () => {
      const { user } = await createTestUser("CUSTOMER");
      const { token: adminToken } = await createTestUser("ADMIN");
      const order = await Order.create({
        orderNo: "ORD-002",
        userId: user._id,
        serviceId,
        totalAmount: 150,
        status: "ORDER_PLACED",
        paymentMethod: "NONE",
        paymentStatus: "PENDING"
      });

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set(getAuthHeader(adminToken))
        .send({ status: "WASHING" });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("WASHING");
    });
  });
});
