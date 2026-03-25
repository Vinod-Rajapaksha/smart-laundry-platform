import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} from './validation.js';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
} from './controller.js';

const router = Router();

// Get user statistics (must be before :id routes)
router.get('/stats', auth, allowRoles('ADMIN'), getUserStats);

// Get all users with pagination and filtering
router.get('/', auth, allowRoles('ADMIN'), getAllUsers);

// Create a new user
router.post('/', auth, allowRoles('ADMIN'), validateCreateUser, createUser);

// Get user by ID
router.get('/:id', auth, validateUserId, getUserById);

// Update user
router.put('/:id', auth, validateUserId, validateUpdateUser, updateUser);

// Delete user (soft delete)
router.delete('/:id', auth, allowRoles('ADMIN'), validateUserId, deleteUser);

// Toggle user status
router.patch('/:id/toggle-status', auth, allowRoles('ADMIN'), validateUserId, toggleUserStatus);

export default router;
