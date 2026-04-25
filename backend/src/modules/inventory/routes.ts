import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import {
  validateBody,
  validateParams,
  validateQuery
} from '../../middleware/validate.js';
import * as controller from './controller.js';
import {
  createInventorySchema,
  updateInventorySchema,
  inventoryIdParamSchema,
  getInventoryQuerySchema
} from '../../validation/inventory.schema.js';

const router = Router();

router.get(
  '/category/:category',
  auth,
  controller.getInventoryByCategory
);

router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.get(
  '/',
  validateQuery(getInventoryQuerySchema),
  controller.getAllInventory
);

router.post(
  '/',
  validateBody(createInventorySchema),
  controller.createInventory
);

router.get(
  '/:id',
  validateParams(inventoryIdParamSchema),
  controller.getInventoryById
);

router.patch(
  '/:id',
  validateParams(inventoryIdParamSchema),
  validateBody(updateInventorySchema),
  controller.updateInventory
);

router.delete(
  '/:id',
  validateParams(inventoryIdParamSchema),
  controller.deleteInventory
);

router.patch(
  '/:id/mark-ordered',
  validateParams(inventoryIdParamSchema),
  controller.markOrdered
);

router.patch(
  '/:id/restock',
  validateParams(inventoryIdParamSchema),
  controller.confirmRestock
);

export default router;
