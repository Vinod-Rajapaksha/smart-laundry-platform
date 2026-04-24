process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from "../testHelpers.js";

describe("Voucher Integration Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("POST /api/vouchers/validate", () => {
    it("should fail without token", async () => {
      const res = await request(app).post("/api/vouchers/validate").send({
        code: "SAVE10",
        orderAmount: 1000,
      });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/vouchers/redeem", () => {
    it("should fail without token", async () => {
      const res = await request(app).post("/api/vouchers/redeem").send({
        voucherId: "507f1f77bcf86cd799439011",
        orderId: "507f1f77bcf86cd799439012",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/vouchers/apply", () => {
    it("should fail without token", async () => {
      const res = await request(app).post("/api/vouchers/apply").send({
        orderId: "507f1f77bcf86cd799439011",
        voucherCode: "SAVE10",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/vouchers/code/:code", () => {
    it("should fail without token", async () => {
      const res = await request(app).get("/api/vouchers/code/SAVE10");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/vouchers", () => {
    it("should fail without admin token", async () => {
      const res = await request(app).post("/api/vouchers").send({
        code: "SAVE10",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      });

      expect(res.status).toBe(401);
    });
  });
});