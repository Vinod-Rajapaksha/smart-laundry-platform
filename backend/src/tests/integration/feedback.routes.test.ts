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

describe("Feedback Integration Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("GET /api/feedback/public", () => {
    it("should return public approved feedbacks", async () => {
      const res = await request(app).get("/api/feedback/public");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Approved feedbacks retrieved successfully");
    });
  });

  describe("GET /api/feedback/public/summary", () => {
    it("should return public feedback summary", async () => {
      const res = await request(app).get("/api/feedback/public/summary");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Feedback summary generated successfully");
    });
  });

  describe("POST /api/feedback", () => {
    it("should fail without customer token", async () => {
      const res = await request(app).post("/api/feedback").send({
        orderId: "507f1f77bcf86cd799439011",
        rating: 5,
        comment: "Good service",
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/feedback/stats", () => {
    it("should fail without admin token", async () => {
      const res = await request(app).get("/api/feedback/stats");

      expect(res.status).toBe(401);
    });
  });
});