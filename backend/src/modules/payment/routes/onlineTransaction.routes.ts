import { Router } from 'express';
import { auth } from '../../../middleware/auth.js';
import {
  getPayHereHashHandler,
  getPayHerePreApprovalHashHandler,
  chargeSavedCardHandler,
  payhereNotifyHandler
} from '../controller/payhere.controller.js';
import { getOnlineTransactionsHandler } from '../controller/onlineTransaction.controller.js';

const router = Router();

router.get('/list', auth, getOnlineTransactionsHandler);

router.get('/payhere/hash/:orderId', auth, getPayHereHashHandler);
router.get('/payhere/pre-approval/hash/:orderId', auth, getPayHerePreApprovalHashHandler);

router.post('/payhere/charge-saved-card', auth, chargeSavedCardHandler);
router.post('/payhere/notify', auth, payhereNotifyHandler);

export default router;
