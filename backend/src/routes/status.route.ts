import { Router, Request, Response } from "express";
import { ApiResponse } from "../core/apiResponse.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  return ApiResponse(res, 200, "API running", {
    status: "ok",
  });
});

export default router;