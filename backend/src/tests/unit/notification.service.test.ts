process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import Notification from "../../database/models/Notification.js";
import User from "../../database/models/User.js";
import * as notificationService from "../../modules/notification/service.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from "../testHelpers.js";

describe("Notification Service Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("createNotification", () => {
    it("should create notification successfully", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
      });

      const notification = await notificationService.createNotification(
        user._id.toString(),
        {
          title: "Order Updated",
          message: "Your order status changed",
          type: "ORDER_UPDATE",
        },
      );

      expect(notification).toBeDefined();
      expect(notification.title).toBe("Order Updated");
      expect(notification.message).toBe("Your order status changed");
      expect(notification.isRead).toBe(false);
    });
  });

  describe("getMyNotifications", () => {
    it("should return only user's notifications", async () => {
      const userId = new mongoose.Types.ObjectId();
      const otherUserId = new mongoose.Types.ObjectId();

      await Notification.create({
        userId,
        title: "My notification",
        message: "Hello",
      });

      await Notification.create({
        userId: otherUserId,
        title: "Other notification",
        message: "Hi",
      });

      const result = await notificationService.getMyNotifications(userId.toString());

      expect(result.length).toBe(1);
      expect(result[0].title).toBe("My notification");
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      const userId = new mongoose.Types.ObjectId();

      const notification = await Notification.create({
        userId,
        title: "Unread",
        message: "Message",
        isRead: false,
      });

      const result = await notificationService.markAsRead(
        notification._id.toString(),
        userId.toString(),
      );

      expect(result).toBeDefined();
      expect(result?.isRead).toBe(true);
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all user notifications as read", async () => {
      const userId = new mongoose.Types.ObjectId();

      await Notification.create({
        userId,
        title: "One",
        message: "Message one",
        isRead: false,
      });

      await Notification.create({
        userId,
        title: "Two",
        message: "Message two",
        isRead: false,
      });

      await notificationService.markAllAsRead(userId.toString());

      const unread = await Notification.find({
        userId,
        isRead: false,
      });

      expect(unread.length).toBe(0);
    });
  });

  describe("deleteNotification", () => {
    it("should delete user's notification", async () => {
      const userId = new mongoose.Types.ObjectId();

      const notification = await Notification.create({
        userId,
        title: "Delete me",
        message: "Delete message",
      });

      await notificationService.deleteNotification(
        notification._id.toString(),
        userId.toString(),
      );

      const deleted = await Notification.findById(notification._id);

      expect(deleted).toBeNull();
    });
  });

  describe("updatePushToken", () => {
    it("should update user push token", async () => {
      const user = await User.create({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "Test@1234",
        role: "CUSTOMER",
      });

      await notificationService.updatePushToken(
        user._id.toString(),
        "ExponentPushToken[test-token]",
      );

      const updatedUser = await User.findById(user._id);

      expect(updatedUser?.pushToken).toBe("ExponentPushToken[test-token]");
    });
  });
});