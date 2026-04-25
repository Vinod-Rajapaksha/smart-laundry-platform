import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import * as controller from './controller.js';
import {
  validateCreateSupplier,
  validateSupplierId,
  validateUpdateSupplier,
} from './validation.js';

const router = Router();

// Stats first to avoid ID collision
router.get('/stats', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getSupplierStats);

router.get('/', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), controller.getSuppliers);
router.get('/:id', auth, allowRoles(ROLES.ADMIN, ROLES.STAFF), validateSupplierId, controller.getSupplierById);
router.post('/', auth, allowRoles(ROLES.ADMIN), validateCreateSupplier, controller.createSupplier);
router.patch('/:id', auth, allowRoles(ROLES.ADMIN), validateUpdateSupplier, controller.updateSupplier);
router.delete('/:id', auth, allowRoles(ROLES.ADMIN), validateSupplierId, controller.deleteSupplier);

export default router;
