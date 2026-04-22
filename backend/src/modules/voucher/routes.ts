import { Router } from 'express';
import * as controller from './controller.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import {
  createVoucherSchema,
  updateVoucherSchema,
  voucherCodeParamSchema,
  applyVoucherSchema,
  applyToOrderSchema,
  redeemVoucherSchema
} from '../../validation/voucher.schema.js';

const router = Router();

router.use(auth);

router.post('/validate', validateBody(applyVoucherSchema), controller.validateVoucher);
router.post('/redeem', validateBody(redeemVoucherSchema), controller.redeemVoucher);
router.post('/apply', allowRoles(ROLES.CUSTOMER), validateBody(applyToOrderSchema), controller.applyToOrder);
router.get('/code/:code', validateParams(voucherCodeParamSchema), controller.getVoucherByCode);

router.post('/', allowRoles(ROLES.ADMIN), validateBody(createVoucherSchema), controller.createVoucher);
router.put('/:id', allowRoles(ROLES.ADMIN), validateBody(updateVoucherSchema), controller.updateVoucher);
router.delete('/:id', allowRoles(ROLES.ADMIN), controller.deleteVoucher);
router.get('/', controller.getAllVouchers);

export default router;
