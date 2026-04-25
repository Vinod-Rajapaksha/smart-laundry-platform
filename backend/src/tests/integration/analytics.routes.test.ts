process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";

describe("Analytics Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("GET /api/analytics/dashboard (Admin Only)", () => {
    it("should return dashboard KPIs for admin", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .get("/api/analytics/dashboard")
        .set(getAuthHeader(adminToken));

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("newOrders");
    });

    it("should return 403 for staff trying to access admin dashboard", async () => {
      const { token: staffToken } = await createTestUser("STAFF");
      const res = await request(app)
        .get("/api/analytics/dashboard")
        .set(getAuthHeader(staffToken));

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/analytics/revenue", () => {
    it("should add a revenue record", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/analytics/revenue")
        .set(getAuthHeader(adminToken))
        .send({
          name: "Test Revenue",
          amount: 500,
          date: new Date(),
          sourceType: "MANUAL"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(500);
    });
  });
});
