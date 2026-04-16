
import { Router } from 'express';
import * as reportGenController from './reportGenController.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';


const router = Router();

// Protect all reportGen routes: only ADMIN can access
router.post('/generate', auth, allowRoles('ADMIN'), reportGenController.generateReport);
router.get('/reports', auth, allowRoles('ADMIN'), reportGenController.listGeneratedReports);
router.get('/reports/:id/download', auth, allowRoles('ADMIN'), reportGenController.downloadGeneratedReport);

export default router;
