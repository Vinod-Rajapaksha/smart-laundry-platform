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

describe("Notification Integration Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("GET /api/notifications", () => {
    it("should fail without token", async () => {
      const res = await request(app).get("/api/notifications");

      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/notifications/token", () => {
    it("should fail without token", async () => {
      const res = await request(app).patch("/api/notifications/token").send({
        token: "ExponentPushToken[test-token]",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    it("should fail without token", async () => {
      const res = await request(app)
        .patch("/api/notifications/507f1f77bcf86cd799439011/read");

      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/notifications/read-all", () => {
    it("should fail without token", async () => {
      const res = await request(app).patch("/api/notifications/read-all");

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/notifications/:id", () => {
    it("should fail without token", async () => {
      const res = await request(app)
        .delete("/api/notifications/507f1f77bcf86cd799439011");

      expect(res.status).toBe(401);
    });
  });
});