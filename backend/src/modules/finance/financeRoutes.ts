import { Router } from 'express';
import * as financeController from './financeController.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';


const router = Router();

// Protect all finance routes: only ADMIN can access
router.get('/summary', auth, allowRoles('ADMIN'), financeController.getFinanceSummary);
router.get('/revenue', auth, allowRoles('ADMIN'), financeController.getAllRevenues);
router.get('/expense', auth, allowRoles('ADMIN'), financeController.getAllExpenses);
router.post('/revenue', auth, allowRoles('ADMIN'), financeController.addRevenue);
router.post('/expense', auth, allowRoles('ADMIN'), financeController.addExpense);

export default router;
