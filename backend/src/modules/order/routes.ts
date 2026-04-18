import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './controller.js';
import * as validation from './validation.js';

const router = Router();

// Get current user's orders
router.get(
  '/my',
  auth,
  allowRoles(ROLES.CUSTOMER),
  validate(validation.validateGetOrders),
  controller.getMyOrders
);

// Create new order
router.post(
  '/',
  auth,
  allowRoles(ROLES.CUSTOMER),
  validate(validation.validateCreateOrder),
  controller.createOrder
);

// Get all orders
router.get(
  '/',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validate(validation.validateGetOrders),
  controller.getAllOrders
);

// Update order status
router.patch(
  '/:id/status',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validate(validation.validateUpdateOrderStatus),
  controller.updateOrderStatus
);

// Get available orders for riders
router.get(
  '/available',
  auth,
  allowRoles(ROLES.STAFF),
  controller.getAvailableOrders
);

// Get tasks assigned to current staff
router.get(
  '/tasks',
  auth,
  allowRoles(ROLES.STAFF),
  controller.getStaffTasks
);

// Get order by ID
router.get(
  '/:id',
  auth,
  validate(validation.validateOrderId),
  controller.getOrderById
);

// Claim an order (staff only)
router.patch(
  '/:id/claim',
  auth,
  allowRoles(ROLES.STAFF),
  validate(validation.validateOrderId),
  controller.claimOrder
);

// Download order receipt
router.get(
  '/:id/receipt',
  auth,
  validate(validation.validateOrderId),
  controller.downloadReceipt
);

export default router;