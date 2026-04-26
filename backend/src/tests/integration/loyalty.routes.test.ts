process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import CustomerLoyalty from "../../database/models/CustomerLoyalty.js";
import LoyaltyTier from "../../database/models/LoyaltyTier.js";

describe("Loyalty Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("GET /api/loyalty/status", () => {
    it("should return loyalty status for a customer", async () => {
      const { user, token } = await createTestUser("CUSTOMER");
      const tier = await LoyaltyTier.create({
        name: "BRONZE",
        minPoints: 0,
        discountValue: 0
      });

      await CustomerLoyalty.create({
        userId: user._id,
        tierId: tier._id,
        points: 150
      });

      const res = await request(app)
        .get("/api/loyalty/status")
        .set(getAuthHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.points).toBe(150);
    });
  });

  describe("GET /api/loyalty/tiers", () => {
    it("should list loyalty tiers", async () => {
      const { token } = await createTestUser("CUSTOMER");
      const res = await request(app)
        .get("/api/loyalty/tiers")
        .set(getAuthHeader(token));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
