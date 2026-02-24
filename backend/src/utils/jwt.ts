import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config/env.js";
import { Role } from "../core/constants.js";

export interface AuthPayload extends JwtPayload {
  id: string;
  role: Role;
}

const ACCESS_SECRET: string = config.JWT_SECRET!;
const REFRESH_SECRET: string = config.JWT_REFRESH_SECRET!;

const accessOptions: SignOptions = {
  expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
};

const refreshOptions: SignOptions = {
  expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
};

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, accessOptions);
};

export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, refreshOptions);
};

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, ACCESS_SECRET) as AuthPayload;
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
};