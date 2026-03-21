import { Router } from "express";
import statusRoute from "./status.route.js";
import authRoutes from '../modules/auth/routes.js';
import financeRoutes from '../modules/finance/index.js';
import reportGenRoutes from '../modules/reportGen/index.js';

const router = Router();

router.use("/status", statusRoute);
router.use('/auth', authRoutes);
router.use('/finance', financeRoutes);
router.use('/reportGen', reportGenRoutes);

export default router;
