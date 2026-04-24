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

describe("Loyalty Integration Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("GET /api/loyalty/status", () => {
    it("should fail without token", async () => {
      const res = await request(app).get("/api/loyalty/status");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/loyalty/history", () => {
    it("should fail without token", async () => {
      const res = await request(app).get("/api/loyalty/history");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/loyalty/tiers", () => {
    it("should fail without token", async () => {
      const res = await request(app).get("/api/loyalty/tiers");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/loyalty/customers", () => {
    it("should fail without admin or staff token", async () => {
      const res = await request(app).get("/api/loyalty/customers");

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/loyalty/transactions", () => {
    it("should fail without admin or staff token", async () => {
      const res = await request(app).get("/api/loyalty/transactions");

      expect(res.status).toBe(401);
    });
  });
});