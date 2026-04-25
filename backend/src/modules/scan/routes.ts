import { Router } from 'express';
import multer from 'multer';
import * as scanController from './controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/decode', auth, upload.single('image'), scanController.decodeQrCode);

export default router;
