import jwt from "jsonwebtoken";
import config from "../config/env.js";
const ACCESS_SECRET = config.JWT_SECRET;
const REFRESH_SECRET = config.JWT_REFRESH_SECRET;
const accessOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
};
const refreshOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
};
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, accessOptions);
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, refreshOptions);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
