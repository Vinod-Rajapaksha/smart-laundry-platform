import { Router } from 'express';
import * as reportGenController from './reportGenController.js';

const router = Router();

router.post('/generate', reportGenController.generateReport);
router.get('/reports', reportGenController.listGeneratedReports);
router.get('/reports/:id/download', reportGenController.downloadGeneratedReport);

export default router;
