process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import ServiceCategory from "../../database/models/ServiceCategory.js";

describe("Service Category Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("POST /api/service-categories", () => {
    it("should create a new service category", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/categories")
        .set(getAuthHeader(adminToken))
        .send({
          name: "Laundry",
          description: "General laundry services"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Laundry");
    });
  });

  describe("GET /api/service-categories", () => {
    it("should list all categories", async () => {
      const { token: staffToken } = await createTestUser("STAFF");
      await ServiceCategory.create({ name: "Dry Cleaning" });

      const res = await request(app)
        .get("/api/categories")
        .set(getAuthHeader(staffToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
