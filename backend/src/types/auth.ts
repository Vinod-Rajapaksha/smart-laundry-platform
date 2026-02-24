import { Request } from "express";
import { Role } from "../core/constants.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    email: string;
  };
}