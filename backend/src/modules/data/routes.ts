import { Router } from "express";
import { getDashboardData, getDashboardUsersController } from "./controller.js";

const router = Router();

router.get("/dashboard", getDashboardData);
router.get("/users", getDashboardUsersController);

export default router;
