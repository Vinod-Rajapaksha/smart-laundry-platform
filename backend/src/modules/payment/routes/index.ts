import { Router } from 'express';
import { initBankTransfer, initCOD } from '../controller/payment.controller.js';
import { auth } from '../../../middleware/auth.js';
import bankTransferRoutes from './bankTransfer.routes.js';
import onlineTransactionRoutes from './onlineTransaction.routes.js';
import savedCardRoutes from './savedCard.routes.js';
import codRoutes from './cod.routes.js';

const router = Router();

router.post('/bank/init/:orderId', auth, initBankTransfer);
router.post('/cod/init/:orderId', auth, initCOD);

router.use('/bank-transfer', auth, bankTransferRoutes);
router.use('/online', auth, onlineTransactionRoutes);
router.use('/cards', auth, savedCardRoutes);
router.use('/cod', auth, codRoutes);

export default router;