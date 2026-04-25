import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validate } from '../../middleware/validate.js';
import * as controller from './controller.js';
import * as validation from './validation.js';

const router = Router();

router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.get('/', controller.getAllCategories);
router.get('/:id', validate(validation.validateInventoryCategoryId), controller.getCategoryById);

router.post('/', validate(validation.validateCreateInventoryCategory), controller.createCategory);
router.patch('/:id', validate(validation.validateUpdateInventoryCategory), controller.updateCategory);
router.delete('/:id', validate(validation.validateInventoryCategoryId), controller.deleteCategory);

export default router;
