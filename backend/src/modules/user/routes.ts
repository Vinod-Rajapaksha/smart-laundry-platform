import { Router } from 'express';
import * as controller from './controller.js';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import { ROLES } from '../../core/constants.js';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.js';
import {
  getUsersQuerySchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
} from '../../validation/user.schema.js';
import { upload } from '../../middleware/upload.js';

const router = Router();

router.use(auth);

router.get('/profile', controller.getProfile);
router.put('/profile', validateBody(updateUserSchema), controller.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), controller.uploadAvatar);
router.post('/profile/change-password', controller.changePassword);
router.delete('/profile', controller.deleteProfile);

router.get(
  '/',
  allowRoles(ROLES.ADMIN),
  validateQuery(getUsersQuerySchema),
  controller.getUsers
);

router.post(
  '/',
  allowRoles(ROLES.ADMIN),
  validateBody(createUserSchema),
  controller.createUser
);

router.get(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validateParams(userIdParamSchema),
  controller.getUserById
);

router.patch(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  controller.updateUser
);

router.delete(
  '/:id',
  allowRoles(ROLES.ADMIN),
  validateParams(userIdParamSchema),
  controller.deleteUser
);

export default router;