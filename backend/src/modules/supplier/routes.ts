import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import * as controller from './controller.js';
import {
  createSupplierSchema,
  updateSupplierSchema,
  supplierIdParamSchema
} from '../../validation/supplier.schema.js';

const router = Router();

router.get('/stats', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getSupplierStats);

router.get('/', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getSuppliers);
router.get('/:id', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), validateParams(supplierIdParamSchema), controller.getSupplierById);
router.post('/', auth, allowRoles(ROLES.ADMIN), validateBody(createSupplierSchema), controller.createSupplier);
router.patch('/:id', auth, allowRoles(ROLES.ADMIN), validateParams(supplierIdParamSchema), validateBody(updateSupplierSchema), controller.updateSupplier);
router.delete('/:id', auth, allowRoles(ROLES.ADMIN), validateParams(supplierIdParamSchema), controller.deleteSupplier);

export default router;
