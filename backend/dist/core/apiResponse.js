export const ApiResponse = (res, statusCode, message = "Success", data) => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
    });
};
