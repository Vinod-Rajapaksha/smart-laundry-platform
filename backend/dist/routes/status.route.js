import { Router } from "express";
import { ApiResponse } from "../core/apiResponse.js";
const router = Router();
router.get("/", (_req, res) => {
    return ApiResponse(res, 200, "API running", {
        status: "ok",
    });
});
export default router;
