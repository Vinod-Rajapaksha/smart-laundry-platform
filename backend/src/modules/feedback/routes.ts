import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import * as controller from './controller.js';
import {
  validateCreateFeedback,
  validateFeedbackId,
  validateGetFeedbacks,
  validateUpdateStatus,
  validateUpdateMyFeedback,
  validateDeleteMyFeedback
} from './validation.js';

const router = Router();
router.get('/public', controller.getApprovedFeedbacks);
router.get('/public/summary', controller.getFeedbackSummary);

router.post('/',auth,allowRoles(ROLES.CUSTOMER),validateCreateFeedback,controller.createFeedback,);

router.get('/my/:orderId',auth,allowRoles(ROLES.CUSTOMER),controller.getMyFeedbackForOrder,);
router.patch('/my/:id',auth,allowRoles(ROLES.CUSTOMER),validateUpdateMyFeedback,controller.updateMyFeedbackController,);
router.delete('/my/:id',auth,allowRoles(ROLES.CUSTOMER),validateDeleteMyFeedback,controller.deleteMyFeedbackController,);
router.get('/my', auth, allowRoles(ROLES.CUSTOMER), controller.getMyAllFeedbacksController);

router.get('/stats',auth,allowRoles(ROLES.ADMIN),controller.getFeedbackStats,);

router.get('/',auth,allowRoles(ROLES.ADMIN),validateGetFeedbacks, controller.getAllFeedbacks,);
router.get('/:id',auth,allowRoles(ROLES.ADMIN),validateFeedbackId,controller.getFeedbackById,);
router.patch('/:id/status',auth,allowRoles(ROLES.ADMIN),validateUpdateStatus,controller.updateFeedbackStatus,);
router.delete('/:id', auth, allowRoles(ROLES.ADMIN), validateFeedbackId, controller.deleteFeedbackAdminController);

export default router;