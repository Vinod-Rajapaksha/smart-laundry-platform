import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import * as controller from './controller.js';
import { 
  validateBody, 
  validateParams, 
  validateQuery 
} from '../../middleware/validate.js';
import { 
  createFeedbackSchema, 
  updateMyFeedbackSchema, 
  updateFeedbackStatusSchema, 
  getFeedbacksQuerySchema,
  feedbackIdParamSchema
} from '../../validation/feedback.schema.js';

const router = Router();
router.get('/public', controller.getApprovedFeedbacks);
router.get('/public/summary', controller.getFeedbackSummary);

router.post('/', auth, allowRoles(ROLES.CUSTOMER), validateBody(createFeedbackSchema), controller.createFeedback);

router.get('/my/:orderId', auth, allowRoles(ROLES.CUSTOMER), controller.getMyFeedbackForOrder);
router.patch('/my/:id', auth, allowRoles(ROLES.CUSTOMER), validateParams(feedbackIdParamSchema), validateBody(updateMyFeedbackSchema), controller.updateMyFeedbackController);
router.delete('/my/:id', auth, allowRoles(ROLES.CUSTOMER), validateParams(feedbackIdParamSchema), controller.deleteMyFeedbackController);
router.get('/my', auth, allowRoles(ROLES.CUSTOMER), controller.getMyAllFeedbacksController);

router.get('/stats', auth, allowRoles(ROLES.ADMIN), controller.getFeedbackStats);

router.get('/', auth, allowRoles(ROLES.ADMIN), validateQuery(getFeedbacksQuerySchema), controller.getAllFeedbacks);
router.get('/:id', auth, allowRoles(ROLES.ADMIN), validateParams(feedbackIdParamSchema), controller.getFeedbackById);
router.patch('/:id/status', auth, allowRoles(ROLES.ADMIN), validateParams(feedbackIdParamSchema), validateBody(updateFeedbackStatusSchema), controller.updateFeedbackStatus);
router.delete('/:id', auth, allowRoles(ROLES.ADMIN), validateParams(feedbackIdParamSchema), controller.deleteFeedbackAdminController);

export default router;