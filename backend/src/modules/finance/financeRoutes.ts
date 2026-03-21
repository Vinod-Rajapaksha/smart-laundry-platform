import { Router } from 'express';
import * as financeController from './financeController.js';

const router = Router();

router.post('/revenue', financeController.addRevenue);
router.post('/expense', financeController.addExpense);

export default router;
