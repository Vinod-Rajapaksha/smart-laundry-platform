import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import * as controller from './controller.js';
import { 
  createServiceCategorySchema, 
  updateServiceCategorySchema, 
  serviceCategoryIdParamSchema 
} from '../../validation/serviceCategory.schema.js';

const router = Router();

router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.get('/', controller.getAllCategories);
router.get('/:id', validateParams(serviceCategoryIdParamSchema), controller.getCategoryById);

router.post('/', validateBody(createServiceCategorySchema), controller.createCategory);
router.patch('/:id', validateParams(serviceCategoryIdParamSchema), validateBody(updateServiceCategorySchema), controller.updateCategory);
router.delete('/:id', validateParams(serviceCategoryIdParamSchema), controller.deleteCategory);

export default router;