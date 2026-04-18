import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './controller.js';
import * as validation from './validation.js';

const router = Router();

// Public / Customer routes
router.get('/', controller.getAllServices);
router.get('/category/:categoryId', controller.getServicesByCategory);
router.get('/:id', validate(validation.validateServiceId), controller.getServiceById);

// Admin routes
router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.post('/', validate(validation.validateCreateService), controller.createService);
router.patch('/:id', validate(validation.validateUpdateService), controller.updateService);
router.delete('/:id', validate(validation.validateServiceId), controller.deleteService);

export default router;
