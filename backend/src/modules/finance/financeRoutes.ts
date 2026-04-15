import { Router } from 'express';
import * as financeController from './financeController.js';

const router = Router();

router.get('/summary', financeController.getFinanceSummary);
router.get('/revenue', financeController.getAllRevenues);
router.get('/revenue/monthly', financeController.getMonthlyRevenue);
router.get('/expense', financeController.getAllExpenses);
router.post('/revenue', financeController.addRevenue);
router.post('/expense', financeController.addExpense);

export default router;
