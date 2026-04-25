process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB, createTestUser, getAuthHeader } from "../testHelpers.js";
import Inventory from "../../database/models/Inventory.js";
import Supplier from "../../database/models/Supplier.js";

describe("Inventory Integration Tests", () => {
  let supplierId: string;

  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });

  beforeEach(async () => {
    await clearTestDB();
    const supplier = await Supplier.create({
      name: "Supplier A",
      email: "a@s.com",
      contactPerson: "John",
      phone: "0112233445",
      address: "123 St",
      category: "Chemicals",
      status: "ACTIVE"
    });
    supplierId = supplier._id.toString();
  });

  describe("POST /api/inventory", () => {
    it("should create a new inventory item", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const res = await request(app)
        .post("/api/inventory")
        .set(getAuthHeader(adminToken))
        .send({
          name: "Laundry Soap",
          categoryName: "Supplies",
          unit: "KG",
          unitPrice: 50,
          qtyInStock: 10,
          minQty: 5,
          supplierId
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Laundry Soap");
    });
  });

  describe("GET /api/inventory", () => {
    it("should list inventory items", async () => {
      const { token: staffToken } = await createTestUser("STAFF");
      await Inventory.create({
        name: "Item 1",
        categoryName: "Cat1",
        unit: "PCS",
        unitPrice: 1,
        qtyInStock: 10,
        supplierId
      });

      const res = await request(app)
        .get("/api/inventory")
        .set(getAuthHeader(staffToken));

      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
    });
  });

  describe("PATCH /api/inventory/:id/restock", () => {
    it("should restock an item", async () => {
      const { token: adminToken } = await createTestUser("ADMIN");
      const item = await Inventory.create({
        name: "Item R",
        categoryName: "CatR",
        unit: "PCS",
        unitPrice: 1,
        qtyInStock: 10,
        batchQty: 20,
        supplierId
      });

      const res = await request(app)
        .patch(`/api/inventory/${item._id}/restock`)
        .set(getAuthHeader(adminToken));

      expect(res.status).toBe(200);
      expect(res.body.data.qtyInStock).toBe(30);
    });
  });
});
