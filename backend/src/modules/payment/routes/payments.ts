import { Router } from 'express';
import { initBankTransfer, initCOD, initCard, getPayments, verifyPayment } from '../controller/payment.controller.js';
import { auth } from '../../../middleware/auth.js';
import bankTransferRoutes from './bankTransfer.routes.js';
import codPaymentRoutes from './cod.routes.js';
import onlinePaymentRoutes from './onlineTransaction.routes.js';
import savedCardRoutes from './savedCard.routes.js';

const router = Router();

router.get('/', auth, getPayments);
router.post('/:id/verify', auth, verifyPayment);

router.post('/bank/init/:orderId', auth, initBankTransfer);
router.post('/cod/init/:orderId', auth, initCOD);
router.post('/card/init/:orderId', auth, initCard);

router.use('/bank-transfer', bankTransferRoutes);
router.use('/cod', codPaymentRoutes);
router.use('/online', onlinePaymentRoutes);
router.use('/cards', savedCardRoutes);

export default router;