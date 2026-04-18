import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as controller from './loyalty.controller.js';

const router = Router();

router.get('/status', auth, controller.getStatus);
router.get('/history', auth, controller.getHistory);
router.get('/tiers', auth, controller.getTiers);

export default router;
