import { Router } from 'express';
import * as controller from './controller.js';
import * as validation from './validation.js';
import { validate } from '../../middleware/validate.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/my', controller.getMyNotifications);
router.patch('/:id/read', validate(validation.validateNotificationId), controller.markAsRead);
router.patch('/read-all', controller.markAllAsRead);
router.delete('/:id', validate(validation.validateNotificationId), controller.deleteNotification);

export default router;