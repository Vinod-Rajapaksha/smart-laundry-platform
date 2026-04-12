import { Router } from "express";
import statusRoute from "./status.route.js";
import authRoutes from '../modules/auth/routes.js';
import inventoryRoutes from '../modules/inventory/routes.js';
import feedbackRoutes from '../modules/feedback/routes.js';

const router = Router();

router.use("/status", statusRoute);
router.use('/auth', authRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
