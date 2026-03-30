import { Router } from "express";
import statusRoute from "./status.route.js";
import authRoutes from '../modules/auth/routes.js';
<<<<<<< HEAD
import inventoryRoutes from '../modules/inventory/routes.js';
=======
import feedbackRoutes from '../modules/feedback/routes.js';
>>>>>>> develop

const router = Router();

router.use("/status", statusRoute);
router.use('/auth', authRoutes);
<<<<<<< HEAD
router.use('/inventory', inventoryRoutes);
=======
router.use('/feedback', feedbackRoutes);
>>>>>>> develop

export default router;
