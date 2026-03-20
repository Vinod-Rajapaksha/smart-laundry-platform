import ApiError from "../core/apiError.js";
import { MESSAGES } from "../core/constants.js";
export const allowRoles = (...allowedRoles) => (req, _res, next) => {
    if (!req.user || !req.user.role) {
        return next(new ApiError(403, MESSAGES.UNAUTHORIZED));
    }
    if (!allowedRoles.includes(req.user.role)) {
        return next(new ApiError(403, MESSAGES.FORBIDDEN));
    }
    next();
};
