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
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
  getOrdersQuerySchema,
  updateOrderSchema
} from '../../validation/order.schema.js';
import * as deliveryController from './delivery.controller.js';

const router = Router();

router.get(
  '/delivery',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  deliveryController.getJobs
);

router.patch(
  '/delivery/:id/status',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validateParams(orderIdParamSchema),
  deliveryController.updateStatus
);

router.get(
  '/my',
  auth,
  allowRoles(ROLES.CUSTOMER),
  validateQuery(getOrdersQuerySchema),
  controller.getMyOrders
);

router.post(
  '/',
  auth,
  allowRoles(ROLES.CUSTOMER),
  validateBody(createOrderSchema),
  controller.createOrder
);

router.get(
  '/',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validateQuery(getOrdersQuerySchema),
  controller.getAllOrders
);

router.patch(
  '/:id/status',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validateParams(orderIdParamSchema),
  validateBody(updateOrderStatusSchema),
  controller.updateOrderStatus
);

router.get(
  '/available',
  auth,
  allowRoles(ROLES.STAFF, ROLES.ADMIN),
  controller.getAvailableOrders
);

router.get(
  '/tasks',
  auth,
  allowRoles(ROLES.STAFF, ROLES.ADMIN),
  controller.getStaffTasks
);

router.get(
  '/:id',
  auth,
  validateParams(orderIdParamSchema),
  controller.getOrderById
);

router.patch(
  '/:id/claim',
  auth,
  allowRoles(ROLES.STAFF, ROLES.ADMIN),
  validateParams(orderIdParamSchema),
  controller.claimOrder
);

router.post(
  '/:id/arrive',
  auth,
  allowRoles(ROLES.STAFF, ROLES.ADMIN),
  validateParams(orderIdParamSchema),
  controller.notifyArrival
);

router.get(
  '/:id/receipt',
  auth,
  validateParams(orderIdParamSchema),
  controller.downloadReceipt
);

router.patch(
  '/:id/cancel',
  auth,
  allowRoles(ROLES.CUSTOMER),
  validateParams(orderIdParamSchema),
  controller.cancelOrder
);

router.patch(
  '/:id',
  auth,
  allowRoles(ROLES.ADMIN, ROLES.STAFF),
  validateParams(orderIdParamSchema),
  validateBody(updateOrderSchema),
  controller.updateOrder
);

router.delete(
  '/:id',
  auth,
  allowRoles(ROLES.ADMIN),
  validateParams(orderIdParamSchema),
  controller.deleteOrder
);

export default router;