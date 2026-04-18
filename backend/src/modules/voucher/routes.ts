import { Router } from 'express';
import * as controller from './controller.js';
import * as validation from './validation.js';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';

const router = Router();

// Publicly available within authenticated session (for customers to apply)
router.use(auth);

router.post('/validate', validate(validation.validateApplyVoucher), controller.validateVoucher);
router.post('/redeem', validate(validation.validateRedeemVoucher), controller.redeemVoucher);
router.post('/apply', allowRoles(ROLES.CUSTOMER), validate(validation.validateApplyToOrder), controller.applyToOrder);
router.get('/code/:code', validate(validation.validateVoucherCode), controller.getVoucherByCode);

// Admin only routes
router.post('/', allowRoles(ROLES.ADMIN), validate(validation.validateCreateVoucher), controller.createVoucher);
router.get('/', controller.getAllVouchers);

export default router;
