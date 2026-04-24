import { validateNotificationId } from "../../modules/notification/validation.js";

describe("Notification Zod Schema - validateNotificationId", () => {
  it("should pass with valid notification id", () => {
    const result = validateNotificationId.params.safeParse({
      id: "507f1f77bcf86cd799439011",
    });

    expect(result.success).toBe(true);
  });

  it("should fail with invalid notification id", () => {
    const result = validateNotificationId.params.safeParse({
      id: "bad-id",
    });

    expect(result.success).toBe(false);
  });

  it("should fail with empty notification id", () => {
    const result = validateNotificationId.params.safeParse({
      id: "",
    });

    expect(result.success).toBe(false);
  });
});