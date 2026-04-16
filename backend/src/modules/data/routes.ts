
import { Router } from "express";
import { getDashboardData, getDashboardUsersController } from "./controller.js";
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';


const router = Router();

// Protect dashboard data routes: only ADMIN can access
router.get("/dashboard", auth, allowRoles('ADMIN', 'STAFF'), getDashboardData);
router.get("/users", auth, allowRoles('ADMIN'), getDashboardUsersController);

export default router;
