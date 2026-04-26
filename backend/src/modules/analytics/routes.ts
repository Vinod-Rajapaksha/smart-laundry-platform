import { Router } from 'express';
import * as controller from './controller.js';
import { validateBody, validateQuery } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import {
  analyticsQuerySchema,
  monthlyAnalysisSchema,
  addRevenueSchema,
  addExpenseSchema,
  previewReportSchema,
  saveReportSchema
} from '../../validation/analytics.schema.js';

const router = Router();

router.get('/staff-dashboard', auth, allowRoles(ROLES.STAFF, ROLES.ADMIN), controller.getStaffStats);

router.use(auth);
router.use(allowRoles(ROLES.ADMIN));

router.get('/dashboard', validateQuery(analyticsQuerySchema), controller.getDashboardKPIs);
router.get('/monthly', validateQuery(monthlyAnalysisSchema), controller.getMonthlyAnalysis);
router.post('/revenue', validateBody(addRevenueSchema), controller.addRevenue);
router.post('/expense', validateBody(addExpenseSchema), controller.addExpense);
router.post('/reports/preview', validateBody(previewReportSchema), controller.previewReport);
router.post('/reports/save', validateBody(saveReportSchema), controller.saveReport);
router.get('/reports', controller.getReports);
router.get('/reports/download/:id', controller.downloadReport);
router.delete('/reports/:id', controller.deleteReport);

export default router;
