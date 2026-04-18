import { Router } from 'express';
import * as controller from './controller.js';
import * as validation from './validation.js';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';

const router = Router();

// Staff & Admin access
router.get('/staff-dashboard', auth, allowRoles(ROLES.STAFF, ROLES.ADMIN), controller.getStaffStats);

// All other analytics routes require Admin access
router.use(auth);
router.use(allowRoles(ROLES.ADMIN));

router.get('/dashboard', controller.getDashboardKPIs);
router.get('/monthly', validate(validation.validateMonthlyAnalysis), controller.getMonthlyAnalysis);
router.post('/revenue', validate(validation.validateAddRevenue), controller.addRevenue);
router.post('/expense', validate(validation.validateAddExpense), controller.addExpense);
router.post('/reports/preview', validate(validation.validatePreviewReport), controller.previewReport);
router.post('/reports/save', validate(validation.validateSaveReport), controller.saveReport);
router.get('/reports', controller.getReports);
router.get('/reports/download/:id', controller.downloadReport);

export default router;
