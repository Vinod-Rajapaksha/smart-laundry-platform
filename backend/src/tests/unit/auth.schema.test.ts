import { registerSchema, loginSchema, refreshTokenSchema } from "../../validation/auth.schema.js";

describe("Auth Zod Schema - registerSchema", () => {
  const valid = {
    name: "John Doe",
    email: "john@example.com",
    telephone: "0771234567",
    password: "Test@1234",
  };

  it("should pass with valid data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail if name is empty", () => {
    const result = registerSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("should fail for invalid email format", () => {
    const result = registerSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("should fail for invalid Sri Lankan telephone", () => {
    const result = registerSchema.safeParse({ ...valid, telephone: "1234567890" });
    expect(result.success).toBe(false);
  });

  it("should accept +94 format telephone", () => {
    const result = registerSchema.safeParse({ ...valid, telephone: "+94771234567" });
    expect(result.success).toBe(true);
  });

  it("should fail if password lacks uppercase", () => {
    const result = registerSchema.safeParse({ ...valid, password: "test@1234" });
    expect(result.success).toBe(false);
  });

  it("should fail if password lacks a special character", () => {
    const result = registerSchema.safeParse({ ...valid, password: "Test1234" });
    expect(result.success).toBe(false);
  });

  it("should fail if password is too short", () => {
    const result = registerSchema.safeParse({ ...valid, password: "Te@1" });
    expect(result.success).toBe(false);
  });
});

describe("Auth Zod Schema - loginSchema", () => {
  it("should pass with valid email and password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "anything" }).success).toBe(true);
  });

  it("should fail if email is invalid", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "anything" }).success).toBe(false);
  });

  it("should fail if password is empty", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("Auth Zod Schema - refreshTokenSchema", () => {
  it("should pass with a non-empty refresh token", () => {
    expect(refreshTokenSchema.safeParse({ refreshToken: "some.token" }).success).toBe(true);
  });

  it("should fail if refreshToken is empty", () => {
    expect(refreshTokenSchema.safeParse({ refreshToken: "" }).success).toBe(false);
  });
});
