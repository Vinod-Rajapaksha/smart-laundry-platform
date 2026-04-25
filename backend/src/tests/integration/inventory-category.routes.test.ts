process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import InventoryCategory from "../../database/models/InventoryCategory.js";

describe("Inventory Category Integration Tests", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  describe("POST /api/inventory-categories", () => {
    it("should create a new category", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/inventory-categories")
        .set(getAuthHeader(adminToken))
        .send({
          name: "Chemicals",
          description: "All cleaning chemicals"
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Chemicals");
    });
  });

  describe("GET /api/inventory-categories", () => {
    it("should list all categories", async () => {
      const { token: staffToken } = await createTestUser("STAFF");
      await InventoryCategory.create({ name: "C1", description: "D1" });

      const res = await request(app)
        .get("/api/inventory-categories")
        .set(getAuthHeader(staffToken));

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
