process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import CustomerLoyalty from "../../database/models/CustomerLoyalty.js";
import LoyaltyTier from "../../database/models/LoyaltyTier.js";
import LoyaltyTransaction from "../../database/models/LoyaltyTransaction.js";
import User from "../../database/models/User.js";
import * as loyaltyService from "../../modules/loyalty/loyalty.service.js";
import { LOYALTY_TIER_NAME } from "../../core/constants.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from "../testHelpers.js";

describe("Loyalty Service Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("awardLoyaltyPoints", () => {
    it("should create customer loyalty record and award points", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
      });

      await LoyaltyTier.create({
        name: LOYALTY_TIER_NAME.BRONZE,
        minPoints: 0,
        discountType: "PERCENTAGE",
        discountValue: 0,
      });

      const loyalty = await loyaltyService.awardLoyaltyPoints(
        user._id.toString(),
        50,
        new mongoose.Types.ObjectId().toString(),
      );

      expect(loyalty).toBeDefined();
      expect(loyalty.points).toBe(50);

      const transaction = await LoyaltyTransaction.findOne({
        loyaltyId: loyalty._id,
      });

      expect(transaction).toBeDefined();
      expect(transaction?.points).toBe(50);
      expect(transaction?.type).toBe("EARNED");
    });

    it("should upgrade tier when points match higher tier", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john2@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
      });

      await LoyaltyTier.create({
        name: LOYALTY_TIER_NAME.BRONZE,
        minPoints: 0,
        discountValue: 0,
      });

      const silverTier = await LoyaltyTier.create({
        name: "SILVER",
        minPoints: 100,
        discountValue: 5,
      });

      const loyalty = await loyaltyService.awardLoyaltyPoints(
        user._id.toString(),
        120,
        new mongoose.Types.ObjectId().toString(),
      );

      expect(loyalty.points).toBe(120);
      expect(loyalty.tierId.toString()).toBe(silverTier._id.toString());
    });
  });

  describe("getLoyaltyStatus", () => {
    it("should return loyalty status for user", async () => {
      const user = await User.create({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
      });

      const tier = await LoyaltyTier.create({
        name: LOYALTY_TIER_NAME.BRONZE,
        minPoints: 0,
        discountValue: 0,
      });

      await CustomerLoyalty.create({
        userId: user._id,
        tierId: tier._id,
        points: 20,
        totalSpent: 0,
      });

      const result = await loyaltyService.getLoyaltyStatus(user._id.toString());

      expect(result).toBeDefined();
      expect(result?.points).toBe(20);
    });
  });

  describe("getLoyaltyHistory", () => {
    it("should return loyalty transaction history", async () => {
      const userId = new mongoose.Types.ObjectId();

      const tier = await LoyaltyTier.create({
        name: LOYALTY_TIER_NAME.BRONZE,
        minPoints: 0,
        discountValue: 0,
      });

      const loyalty = await CustomerLoyalty.create({
        userId,
        tierId: tier._id,
        points: 30,
      });

      await LoyaltyTransaction.create({
        loyaltyId: loyalty._id,
        type: "EARNED",
        points: 30,
        description: "Test transaction",
      });

      const result = await loyaltyService.getLoyaltyHistory(userId.toString());

      expect(result.length).toBe(1);
      expect(result[0].points).toBe(30);
    });
  });

  describe("getAllTiers", () => {
    it("should return active tiers only", async () => {
      await LoyaltyTier.create({
        name: "BRONZE",
        minPoints: 0,
        discountValue: 0,
        isActive: true,
      });

      await LoyaltyTier.create({
        name: "OLD",
        minPoints: 500,
        discountValue: 10,
        isActive: false,
      });

      const result = await loyaltyService.getAllTiers();

      expect(result.length).toBe(1);
      expect(result[0].name).toBe("BRONZE");
    });
  });
});