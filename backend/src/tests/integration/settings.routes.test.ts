process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";

describe("Settings Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("PATCH /api/settings/feedback/ai-toggle", () => {
    it("should toggle AI feedback summary setting", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .patch("/api/settings/feedback/ai-toggle")
        .set(getAuthHeader(adminToken))
        .send({ enabled: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
