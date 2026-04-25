process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import Notification from "../../database/models/Notification.js";

describe("Notification Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("GET /api/notifications", () => {
    it("should list notifications for the logged in user", async () => {
      const { user, token } = await createTestUser("CUSTOMER");
      await Notification.create({
        userId: user._id,
        title: "Test",
        message: "Message",
        type: "SYSTEM"
      });

      const res = await request(app)
        .get("/api/notifications")
        .set(getAuthHeader(token));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("PATCH /api/notifications/token", () => {
    it("should update push token", async () => {
      const { token } = await createTestUser("CUSTOMER");
      const res = await request(app)
        .patch("/api/notifications/token")
        .set(getAuthHeader(token))
        .send({ token: "ExponentPushToken[xxx]" });

      expect(res.status).toBe(200);
    });
  });
});
