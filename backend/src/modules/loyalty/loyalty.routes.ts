import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as controller from './loyalty.controller.js';
import { ROLES } from '../../core/constants.js';
import { allowRoles } from '../../middleware/role.js';

const router = Router();

router.get('/status', auth, controller.getStatus);
router.get('/history', auth, controller.getHistory);
router.get('/tiers', auth, controller.getTiers);
router.patch('/tiers/:id', auth, allowRoles(ROLES.ADMIN), controller.updateTier);
router.get('/customers', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getCustomerLoyalty);
router.get('/transactions', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getAllTransactions);

export default router;
