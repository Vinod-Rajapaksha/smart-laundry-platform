import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

const config = {
  PORT: Number(process.env.PORT) || 5000,

  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  API_BASE_URL: process.env.API_BASE_URL,

  BANK_NAME: process.env.BANK_NAME,
  BANK_ACCOUNT_NO: process.env.BANK_ACCOUNT_NO,
  BANK_ACCOUNT_NAME: process.env.BANK_ACCOUNT_NAME,
  BANK_BRANCH: process.env.BANK_BRANCH,

  PAYHERE_BASE_URL: process.env.PAYHERE_BASE_URL,
  PAYHERE_MERCHANT_ID: process.env.PAYHERE_MERCHANT_ID,
  PAYHERE_SECRET: process.env.PAYHERE_SECRET,
  PAYHERE_APP_ID: process.env.PAYHERE_APP_ID,
  PAYHERE_APP_SECRET: process.env.PAYHERE_APP_SECRET,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default config;