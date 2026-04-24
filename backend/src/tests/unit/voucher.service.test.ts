process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import Voucher from "../../database/models/Voucher.js";
import VoucherRedemption from "../../database/models/VoucherRedemption.js";
import User from "../../database/models/User.js";
import * as voucherService from "../../modules/voucher/service.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from "../testHelpers.js";

describe("Voucher Service Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("createVoucher", () => {
    it("should create voucher successfully", async () => {
      const voucher = await voucherService.createVoucher({
        code: "SAVE10",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      });

      expect(voucher).toBeDefined();
      expect(voucher.code).toBe("SAVE10");
      expect(voucher.discountValue).toBe(10);
      expect(voucher.isActive).toBe(true);
    });
  });

  describe("getAllVouchers", () => {
    it("should return all vouchers", async () => {
      await Voucher.create({
        code: "SAVE10",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      });

      const result = await voucherService.getAllVouchers();

      expect(result.length).toBe(1);
      expect(result[0].code).toBe("SAVE10");
    });
  });

  describe("getVoucherByCode", () => {
    it("should return active voucher by code", async () => {
      await Voucher.create({
        code: "SAVE20",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        isActive: true,
      });

      const result = await voucherService.getVoucherByCode("SAVE20");

      expect(result).toBeDefined();
      expect(result.code).toBe("SAVE20");
    });

    it("should throw error if voucher is inactive", async () => {
      await Voucher.create({
        code: "OLD10",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        isActive: false,
      });

      await expect(voucherService.getVoucherByCode("OLD10")).rejects.toThrow(
        "Voucher not found or inactive",
      );
    });
  });

  describe("validateVoucher", () => {
    it("should validate active voucher successfully", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
        membership: {
          level: "BRONZE",
        },
      });

      await Voucher.create({
        code: "VALID10",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 100,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000),
        isActive: true,
      });

      const result = await voucherService.validateVoucher(
        "VALID10",
        user._id.toString(),
        500,
      );

      expect(result.code).toBe("VALID10");
    });

    it("should fail if order amount is below minimum", async () => {
      const user = await User.create({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
        membership: {
          level: "BRONZE",
        },
      });

      await Voucher.create({
        code: "MIN500",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 500,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000),
      });

      await expect(
        voucherService.validateVoucher("MIN500", user._id.toString(), 100),
      ).rejects.toThrow("Minimum order amount");
    });

    it("should fail for non-bronze member", async () => {
      const user = await User.create({
        name: "Gold User",
        email: "gold@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
        membership: {
          level: "GOLD",
        },
      });

      await Voucher.create({
        code: "BRONZEONLY",
        voucherType: "GENERAL",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 0,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 86400000),
      });

      await expect(
        voucherService.validateVoucher("BRONZEONLY", user._id.toString(), 1000),
      ).rejects.toThrow("Vouchers are only available for Bronze members");
    });
  });

  describe("redeemVoucher", () => {
    it("should create voucher redemption", async () => {
      const voucherId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();
      const orderId = new mongoose.Types.ObjectId().toString();

      const redemption = await voucherService.redeemVoucher(
        voucherId,
        userId,
        orderId,
      );

      expect(redemption).toBeDefined();
      expect(redemption.voucherId.toString()).toBe(voucherId);
      expect(redemption.userId.toString()).toBe(userId);
      expect(redemption.orderId.toString()).toBe(orderId);
    });
  });
});