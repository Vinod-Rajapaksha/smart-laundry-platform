import { Router } from 'express';
import { auth } from '../../../middleware/auth.js';
import { getCashOnDeliveriesHandler, confirmCOD } from '../controller/cod.controller.js';

const router = Router();

router.get('/list', auth, getCashOnDeliveriesHandler);

router.post('/confirm', auth, confirmCOD);
router.patch('/:id/status', auth, confirmCOD);

export default router;
