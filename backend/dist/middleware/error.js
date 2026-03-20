import ApiError from "../core/apiError.js";
import { ApiResponse } from "../core/apiResponse.js";
import logger from "../config/logger.js";
const errorHandler = (err, _req, res, _next) => {
    logger.error(err);
    if (err instanceof ApiError) {
        return ApiResponse(res, err.statusCode, err.message, null);
    }
    return ApiResponse(res, 500, "Internal Server Error", null);
};
export default errorHandler;
