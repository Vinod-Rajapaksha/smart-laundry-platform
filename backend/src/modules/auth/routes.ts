import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../../validation/auth.schema.js';
import { login, refreshToken, register, logout, forgotPassword, verifyOtp, resetPassword } from './controller.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/refresh-token', validateBody(refreshTokenSchema), refreshToken);

router.post('/logout', auth, logout);

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
