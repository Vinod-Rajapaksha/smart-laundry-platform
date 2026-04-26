import { Router } from 'express';
import { auth } from '../../../middleware/auth.js';
import { upload } from '../../../middleware/upload.js';
import { validateBody } from '../../../middleware/validate.js';
import { submitBankTransferSchema, verifyTransferSchema } from '../../../validation/payment.schema.js';
import { submitTransferHandler, getTransfersHandler, verifyTransferHandler } from '../controller/bankTransfer.controller.js';

const router = Router();

router.get('/', auth, getTransfersHandler);

router.post('/submit', auth, upload.single('slipFile'), validateBody(submitBankTransferSchema), submitTransferHandler);
router.post('/:id/verify', auth, validateBody(verifyTransferSchema), verifyTransferHandler);

export default router;