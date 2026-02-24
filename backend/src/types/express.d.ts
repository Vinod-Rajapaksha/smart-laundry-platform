import { Role } from "../core/constants.js";

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}