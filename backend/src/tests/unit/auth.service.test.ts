import { jest } from "@jest/globals";

jest.mock("../../database/models/User.js", () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../utils/password.js", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock("../../utils/jwt.js", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

import User from "../../database/models/User.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import * as authService from "../../modules/auth/service.js";


const mockedUser = User as jest.Mocked<typeof User>;
const mockedHash = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockedCompare = comparePassword as jest.MockedFunction<typeof comparePassword>;
const mockedGenAccess = generateAccessToken as jest.MockedFunction<typeof generateAccessToken>;
const mockedGenRefresh = generateRefreshToken as jest.MockedFunction<typeof generateRefreshToken>;
const mockedVerifyRefresh = verifyRefreshToken as jest.MockedFunction<typeof verifyRefreshToken>;

const makeUser = (overrides = {}) => ({
  _id: { toString: () => "user123" },
  name: "Test User",
  email: "test@example.com",
  telephone: "0771234567",
  password: "hashedPassword",
  role: "CUSTOMER",
  isActive: true,
  refreshToken: null as string | null,
  toObject: function () {
    return { ...this };
  },
  save: jest.fn<any>().mockResolvedValue(undefined),
  ...overrides,
});

describe("Auth Service - register()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should register a new user successfully", async () => {
    const userData = makeUser();
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(null);
    (mockedHash as jest.MockedFunction<any>).mockResolvedValueOnce("hashedPassword");
    (mockedUser.create as jest.MockedFunction<any>).mockResolvedValueOnce(userData);

    const result = await authService.register({
      name: "Test User",
      email: "test@example.com",
      telephone: "0771234567",
      password: "Test@1234",
    });

    expect(mockedUser.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockedHash).toHaveBeenCalledWith("Test@1234");
    expect(result).toBeDefined();
    expect((result as any).password).toBeUndefined();
  });

  it("should throw 409 if email is already in use", async () => {
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(makeUser());

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

describe("Auth Service - login()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should login successfully and return tokens", async () => {
    const userData = makeUser();
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(userData);
    (mockedCompare as jest.MockedFunction<any>).mockResolvedValueOnce(true);
    (mockedGenAccess as jest.MockedFunction<any>).mockReturnValueOnce("access_token");
    (mockedGenRefresh as jest.MockedFunction<any>).mockReturnValueOnce("refresh_token");

    const result = await authService.login({
      email: "test@example.com",
      password: "Test@1234",
    });

    expect(result).toHaveProperty("accessToken", "access_token");
    expect(result).toHaveProperty("refreshToken", "refresh_token");
    expect((result.user as any).password).toBeUndefined();
  });

  it("should throw 401 if user not found", async () => {
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    await expect(
      authService.login({ email: "noone@example.com", password: "wrong" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("should throw 403 if account is disabled", async () => {
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(
      makeUser({ isActive: false })
    );

    await expect(
      authService.login({ email: "test@example.com", password: "Test@1234" })
    ).rejects.toMatchObject({ statusCode: 403, message: "Account is disabled" });
  });

  it("should throw 401 if password does not match", async () => {
    (mockedUser.findOne as jest.MockedFunction<any>).mockResolvedValueOnce(makeUser());
    (mockedCompare as jest.MockedFunction<any>).mockResolvedValueOnce(false);

    await expect(
      authService.login({ email: "test@example.com", password: "wrong" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe("Auth Service - refreshToken()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return new tokens on valid refresh token", async () => {
    const userData = makeUser({ refreshToken: "valid_refresh" });
    (mockedVerifyRefresh as jest.MockedFunction<any>).mockReturnValueOnce({
      id: "user123",
      role: "CUSTOMER",
    });
    (mockedUser.findById as jest.MockedFunction<any>).mockResolvedValueOnce(userData);
    (mockedGenAccess as jest.MockedFunction<any>).mockReturnValueOnce("new_access");
    (mockedGenRefresh as jest.MockedFunction<any>).mockReturnValueOnce("new_refresh");

    const result = await authService.refreshToken({ refreshToken: "valid_refresh" });

    expect(result).toHaveProperty("accessToken", "new_access");
    expect(result).toHaveProperty("refreshToken", "new_refresh");
  });

  it("should throw 401 if token is invalid", async () => {
    (mockedVerifyRefresh as jest.MockedFunction<any>).mockImplementationOnce(() => {
      throw new Error("invalid token");
    });

    await expect(
      authService.refreshToken({ refreshToken: "bad_token" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("should throw 401 if refresh token does not match stored token", async () => {
    const userData = makeUser({ refreshToken: "stored_token" });
    (mockedVerifyRefresh as jest.MockedFunction<any>).mockReturnValueOnce({
      id: "user123",
      role: "CUSTOMER",
    });
    (mockedUser.findById as jest.MockedFunction<any>).mockResolvedValueOnce(userData);

    await expect(
      authService.refreshToken({ refreshToken: "different_token" })
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});

describe("Auth Service - logout()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should clear refresh token on logout", async () => {
    const userData = makeUser({ refreshToken: "some_token" });
    (mockedUser.findById as jest.MockedFunction<any>).mockResolvedValueOnce(userData);

    const result = await authService.logout("user123");

    expect(result).toBe(true);
    expect(userData.refreshToken).toBeNull();
    expect(userData.save).toHaveBeenCalled();
  });

  it("should throw 404 if user not found", async () => {
    (mockedUser.findById as jest.MockedFunction<any>).mockResolvedValueOnce(null);

    await expect(authService.logout("nonexistent")).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
