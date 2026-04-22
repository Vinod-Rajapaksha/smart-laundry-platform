process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";

describe("Supplier Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("POST /api/suppliers (Admin Only)", () => {
    it("should create a new supplier", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/suppliers")
        .set(getAuthHeader(adminToken))
        .send({
          name: "Global Laundry Supplies",
          email: "sales@gls.com",
          contactPerson: "Mark",
          phone: "0112345678",
          address: "45 Supply Rd",
          category: "Chemicals",
          status: "ACTIVE"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Global Laundry Supplies");
    });
  });

  describe("GET /api/suppliers/stats", () => {
    it("should return supplier stats", async () => {
      const { token: staffToken } = await createTestUser("STAFF");
      const res = await request(app)
        .get("/api/suppliers/stats")
        .set(getAuthHeader(staffToken));

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("totalSuppliers");
    });
  });
});
