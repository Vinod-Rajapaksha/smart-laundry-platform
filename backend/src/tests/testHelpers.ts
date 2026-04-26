import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../database/models/User.js";
import { hashPassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";

let mongoServer: MongoMemoryServer;

export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const createTestUser = async (role = "CUSTOMER") => {
  const hashed = await hashPassword("Test@1234");
  const user = await User.create({
    name: "Test User",
    email: `test_${Math.random()}@example.com`,
    telephone: "0771234567",
    password: hashed,
    role,
    isActive: true,
  });
  const token = generateAccessToken({ id: user._id.toString(), role: user.role });
  return { user, token };
};

export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
