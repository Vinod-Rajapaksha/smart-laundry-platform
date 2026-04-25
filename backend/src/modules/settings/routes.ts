import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import * as controller from './controller.js';

const router = Router();

router.get('/feedback', auth, allowRoles(ROLES.ADMIN), controller.getFeedbackSettings);
router.patch('/feedback/ai-toggle', auth, allowRoles(ROLES.ADMIN), controller.updateAISummaryToggle);

export default router;
