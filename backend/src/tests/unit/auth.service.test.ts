import User from "../../database/models/User.js";
import * as authService from "../../modules/auth/service.js";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../testHelpers.js";

describe("Auth Service", () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe("register()", () => {
    it("should register a new user successfully", async () => {
      const result = await authService.register({
        name: "Test User",
        email: "test@example.com",
        telephone: "0771234567",
        password: "Test@1234",
      });

      expect(result).toBeDefined();
      expect(result.email).toBe("test@example.com");
      expect((result as any).password).toBeUndefined();
    });

    it("should throw 409 if email is already in use", async () => {
      await User.create({
        name: "Existing",
        email: "existing@example.com",
        telephone: "0771234567",
        password: "password123"
      });

      await expect(
        authService.register({
          name: "Test User",
          email: "existing@example.com",
          telephone: "0771234567",
          password: "Test@1234",
        })
      ).rejects.toMatchObject({ statusCode: 409, message: "Email is already in use" });
    });
  });

  describe("login()", () => {
    it("should login successfully and return tokens", async () => {
      await authService.register({
        name: "Test User",
        email: "test@example.com",
        telephone: "0771234567",
        password: "Test@1234",
      });

      const result = await authService.login({
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("logout()", () => {
    it("should clear refresh token on logout", async () => {
      const user = await User.create({
        name: "Test User",
        email: "test@example.com",
        telephone: "0771234567",
        password: "password123",
        refreshToken: "some_token"
      });

      const result = await authService.logout(user._id.toString());
      expect(result).toBe(true);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.refreshToken).toBeNull();
    });
  });
});
