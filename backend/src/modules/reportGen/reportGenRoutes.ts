import { Router } from 'express';
import * as reportGenController from './reportGenController.js';

const router = Router();

router.post('/generate', reportGenController.generateReport);

export default router;
