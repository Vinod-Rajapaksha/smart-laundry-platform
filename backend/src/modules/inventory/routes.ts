import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './controller.js';
import * as validation from './validation.js';

const router = Router();

// Public / Customer routes
router.get(
  '/category/:category',
  auth,
  controller.getInventoryByCategory
);

// Admin / Staff routes
router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.get(
  '/',
  validate(validation.validateGetInventory),
  controller.getAllInventory
);

router.post(
  '/',
  validate(validation.validateCreateInventory),
  controller.createInventory
);

router.get(
  '/:id',
  validate(validation.validateInventoryId),
  controller.getInventoryById
);

router.patch(
  '/:id',
  validate(validation.validateUpdateInventory),
  controller.updateInventory
);

router.delete(
  '/:id',
  validate(validation.validateInventoryId),
  controller.deleteInventory
);

router.patch(
    '/:id/mark-ordered',
    validate(validation.validateInventoryId),
    controller.markOrdered
);

router.patch(
    '/:id/restock',
    validate(validation.validateInventoryId),
    controller.confirmRestock
);

export default router;
