import { Router } from "express";
import statusRoute from "./status.route.js";
import authRoutes from '../modules/auth/routes.js';
import paymentRoutes from '../modules/payment/routes/index.js';
import feedbackRoutes from '../modules/feedback/routes.js';

const router = Router();

router.use("/status", statusRoute);
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
