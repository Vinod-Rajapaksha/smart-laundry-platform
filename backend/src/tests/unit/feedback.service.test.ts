process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import Feedback from "../../database/models/Feedback.js";
import * as feedbackService from "../../modules/feedback/service.js";
import { FEEDBACK_STATUS } from "../../core/constants.js";
import {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
} from "../testHelpers.js";

describe("Feedback Service Tests", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  describe("createFeedback", () => {
    it("should create feedback successfully", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const orderId = new mongoose.Types.ObjectId().toString();

      const feedback = await feedbackService.createFeedback(userId, {
        orderId,
        rating: 5,
        comment: "Good service",
        suggestions: "Keep it up",
        tags: [],
      });

      expect(feedback).toBeDefined();
      expect(feedback.rating).toBe(5);
      expect(feedback.comment).toBe("Good service");
      expect(feedback.status).toBe(FEEDBACK_STATUS.PENDING);
    });
  });

  describe("getFeedbackById", () => {
    it("should return feedback by id", async () => {
      const feedback = await Feedback.create({
        userId: new mongoose.Types.ObjectId(),
        orderId: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: "Nice",
      });

      const result = await feedbackService.getFeedbackById(feedback._id.toString());

      expect(result).toBeDefined();
      expect(result.rating).toBe(4);
    });
  });

  describe("updateFeedbackStatus", () => {
    it("should update feedback status", async () => {
      const feedback = await Feedback.create({
        userId: new mongoose.Types.ObjectId(),
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        status: FEEDBACK_STATUS.PENDING,
      });

      const updated = await feedbackService.updateFeedbackStatus(
        feedback._id.toString(),
        FEEDBACK_STATUS.APPROVED,
      );

      expect(updated.status).toBe(FEEDBACK_STATUS.APPROVED);
    });
  });

  describe("getApprovedFeedbacks", () => {
    it("should return approved feedbacks only", async () => {
      await Feedback.create({
        userId: new mongoose.Types.ObjectId(),
        orderId: new mongoose.Types.ObjectId(),
        rating: 5,
        status: FEEDBACK_STATUS.APPROVED,
        comment: "Approved one",
      });

      await Feedback.create({
        userId: new mongoose.Types.ObjectId(),
        orderId: new mongoose.Types.ObjectId(),
        rating: 2,
        status: FEEDBACK_STATUS.PENDING,
        comment: "Pending one",
      });

      const result = await feedbackService.getApprovedFeedbacks(10);

      expect(result.length).toBe(1);
      expect(result[0].status).toBe(FEEDBACK_STATUS.APPROVED);
    });
  });
});