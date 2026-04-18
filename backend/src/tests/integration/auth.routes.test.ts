process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../../app.js";
import { connectTestDB, disconnectTestDB, clearTestDB } from "../testHelpers.js";

describe("Auth Integration Tests - POST /api/auth/register", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  const validPayload = {
    name: "John Doe",
    email: "john@example.com",
    telephone: "0771234567",
    password: "Test@1234",
  };

  it("should register a new user and return 201", async () => {
    const res = await request(app).post("/api/auth/register").send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).not.toHaveProperty("password");
    expect(res.body.data.email).toBe("john@example.com");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "missing@example.com" });

    expect(res.status).toBe(400);
  });

  it("should return 400 if email format is invalid", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validPayload, email: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("should return 400 if password does not meet complexity requirements", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validPayload, password: "weakpassword" });

    expect(res.status).toBe(400);
  });

  it("should return 409 if email is already registered", async () => {
    await request(app).post("/api/auth/register").send(validPayload);
    const res = await request(app).post("/api/auth/register").send(validPayload);

    expect(res.status).toBe(409);
  });
});

describe("Auth Integration Tests - POST /api/auth/login", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    telephone: "0771234567",
    password: "Test@1234",
  };

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(user);
  });

  it("should login with valid credentials and return tokens", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@example.com", password: "Test@1234" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("refreshToken");
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@example.com", password: "Wrong@1234" });

    expect(res.status).toBe(401);
  });

  it("should return 401 for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Test@1234" });

    expect(res.status).toBe(401);
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "jane@example.com" });

    expect(res.status).toBe(400);
  });
});

describe("Auth Integration Tests - POST /api/auth/refresh-token", () => {
  beforeAll(async () => { await connectTestDB(); });
  afterAll(async () => { await disconnectTestDB(); });
  afterEach(async () => { await clearTestDB(); });

  it("should return 400 if refreshToken is missing", async () => {
    const res = await request(app).post("/api/auth/refresh-token").send({});

    expect(res.status).toBe(400);
  });

  it("should return 401 for an invalid refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken: "totally.invalid.token" });

    expect(res.status).toBe(401);
  });

  it("should return new tokens with a valid refresh token", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Token User",
      email: "token@example.com",
      telephone: "0771234567",
      password: "Test@1234",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "token@example.com", password: "Test@1234" });

    const { refreshToken } = loginRes.body.data;

    const res = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
  });
});
