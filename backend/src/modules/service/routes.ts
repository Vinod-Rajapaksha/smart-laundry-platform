import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import * as controller from './controller.js';
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema
} from '../../validation/service.schema.js';

const router = Router();

router.get('/', controller.getAllServices);
router.get('/category/:categoryId', controller.getServicesByCategory);
router.get('/:id', validateParams(serviceIdParamSchema), controller.getServiceById);

router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.post('/', validateBody(createServiceSchema), controller.createService);
router.patch('/:id', validateParams(serviceIdParamSchema), validateBody(updateServiceSchema), controller.updateService);
router.delete('/:id', validateParams(serviceIdParamSchema), controller.deleteService);

export default router;
