import { Router } from 'express';
import { getProfile, updateProfile } from './controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;