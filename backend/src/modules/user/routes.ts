import { Router } from 'express';
import * as controller from './controller.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validate } from '../../middleware/validate.js';
import * as validation from './user/validation.js';
import { upload } from '../../middleware/upload.js';

const router = Router();

router.use(auth);

// Public/Self routes
router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), controller.uploadAvatar);
router.post('/profile/change-password', controller.changePassword);

// Admin-only routes
router.get(
  '/',
  allowRoles(ROLES.ADMIN),
  validate(validation.validateGetUsers),
  controller.getUsers
);

router.post(
  '/',
  allowRoles(ROLES.ADMIN),
  validate(validation.validateCreateUser),
  controller.createUser
);

router.get(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validate(validation.validateUserId),
  controller.getUserById
);

router.patch(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validate(validation.validateUpdateUser),
  controller.updateUser
);

router.delete(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validate(validation.validateUserId),
  controller.deleteUser
);

export default router;