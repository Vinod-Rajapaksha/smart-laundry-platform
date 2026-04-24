import {
  createFeedbackSchema,
  updateMyFeedbackSchema,
  updateStatusSchema,
} from "../../modules/feedback/validation.js";

describe("Feedback Zod Schema - createFeedbackSchema", () => {
  const valid = {
    orderId: "507f1f77bcf86cd799439011",
    rating: 5,
    comment: "Good service",
    suggestions: "Keep it up",
    tags: [],
  };

  it("should pass with valid data", () => {
    expect(createFeedbackSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail if orderId is empty", () => {
    const result = createFeedbackSchema.safeParse({ ...valid, orderId: "" });
    expect(result.success).toBe(false);
  });

  it("should fail if rating is below 1", () => {
    const result = createFeedbackSchema.safeParse({ ...valid, rating: 0 });
    expect(result.success).toBe(false);
  });

  it("should fail if rating is above 5", () => {
    const result = createFeedbackSchema.safeParse({ ...valid, rating: 6 });
    expect(result.success).toBe(false);
  });
});

describe("Feedback Zod Schema - updateMyFeedbackSchema", () => {
  it("should pass with valid rating", () => {
    expect(updateMyFeedbackSchema.safeParse({ rating: 4 }).success).toBe(true);
  });

  it("should fail if rating is below 1", () => {
    expect(updateMyFeedbackSchema.safeParse({ rating: 0 }).success).toBe(false);
  });

  it("should fail if rating is above 5", () => {
    expect(updateMyFeedbackSchema.safeParse({ rating: 6 }).success).toBe(false);
  });
});

describe("Feedback Zod Schema - updateStatusSchema", () => {
  it("should pass with valid status", () => {
    expect(updateStatusSchema.safeParse({ status: "APPROVED" }).success).toBe(true);
  });

  it("should fail with invalid status", () => {
    expect(updateStatusSchema.safeParse({ status: "WRONG_STATUS" }).success).toBe(false);
  });
});