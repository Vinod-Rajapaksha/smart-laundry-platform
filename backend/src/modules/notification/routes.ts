import { Router } from 'express';
import * as controller from './controller.js';
import { validateParams } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';
import { notificationIdParamSchema } from '../../validation/notification.schema.js';

const router = Router();

router.use(auth);

router.get('/', controller.getMyNotifications);
router.patch('/token', controller.updatePushToken);
router.patch('/:id/read', validateParams(notificationIdParamSchema), controller.markAsRead);
router.patch('/read-all', controller.markAllAsRead);
router.delete('/:id', validateParams(notificationIdParamSchema), controller.deleteNotification);

export default router;