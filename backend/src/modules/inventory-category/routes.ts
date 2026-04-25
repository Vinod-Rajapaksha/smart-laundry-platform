import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import * as controller from './controller.js';
import { 
  createInventoryCategorySchema, 
  updateInventoryCategorySchema, 
  inventoryCategoryIdParamSchema 
} from '../../validation/inventoryCategory.schema.js';

const router = Router();

router.use(auth, allowRoles(ROLES.ADMIN, ROLES.STAFF));

router.get('/', controller.getAllCategories);
router.get('/:id', validateParams(inventoryCategoryIdParamSchema), controller.getCategoryById);

router.post('/', validateBody(createInventoryCategorySchema), controller.createCategory);
router.patch('/:id', validateParams(inventoryCategoryIdParamSchema), validateBody(updateInventoryCategorySchema), controller.updateCategory);
router.delete('/:id', validateParams(inventoryCategoryIdParamSchema), controller.deleteCategory);

export default router;
