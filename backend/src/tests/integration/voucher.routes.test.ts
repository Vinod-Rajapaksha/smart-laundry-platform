process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import Voucher from "../../database/models/Voucher.js";

describe("Voucher Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("POST /api/vouchers (Admin Only)", () => {
    it("should create a new voucher", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/promotions")
        .set(getAuthHeader(adminToken))
        .send({
          code: "SAVE10",
          discountType: "PERCENTAGE",
          discountValue: 10,
          voucherType: "PUBLIC",
          minOrderAmount: 100,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString()
        });

      expect(res.status).toBe(201);
      expect(res.body.data.code).toBe("SAVE10");
    });
  });

  describe("POST /api/vouchers/validate", () => {
    it("should validate a valid voucher", async () => {
      const { token } = await createTestUser("CUSTOMER");
      await Voucher.create({
        code: "VALID10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        voucherType: "PUBLIC",
        minOrderAmount: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        isActive: true
      });

      const res = await request(app)
        .post("/api/promotions/validate")
        .set(getAuthHeader(token))
        .send({ code: "VALID10", orderAmount: 100 });

      expect(res.status).toBe(200);
      expect(res.body.data.code).toBe("VALID10");
    });
  });
});
