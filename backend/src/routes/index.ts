import { Router } from "express";
import statusRoute from "./status.route.js";
import analyticsRoutes from '../modules/analytics/routes.js';
import authRoutes from '../modules/auth/routes.js';
import notificationRoutes from '../modules/notification/routes.js';
import voucherRoutes from '../modules/voucher/routes.js';
import paymentRoutes from '../modules/payment/routes/index.js';
import feedbackRoutes from '../modules/feedback/routes.js';
import inventoryRoutes from '../modules/inventory/routes.js';
import orderRoutes from '../modules/order/routes.js';
import serviceRoutes from '../modules/service/routes.js';
import userRoutes from '../modules/user/routes.js';

const router = Router();

router.use("/status", statusRoute);
router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/promotions', voucherRoutes);
router.use('/payments', paymentRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/services', serviceRoutes);
router.use('/users', userRoutes);

export default router;
