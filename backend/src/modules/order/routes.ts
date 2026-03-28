import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { allowRoles } from '../../middleware/role.js';
import {
  validateUpdateStatus,
  validateUpdateLocation,
} from './validation.js';
import {
  getAvailablePickups,
  getAvailableDeliveries,
  assignJob,
  getMyJobs,
  updateJobStatus,
  updateLocation,
  getDeliveryDashboard
} from './controller.js';

const router = Router();

// ── GET routes ──────────────────────────
router.get(
  '/available-pickups',
  auth,
  allowRoles('STAFF'),
  getAvailablePickups
);

router.get(
  '/available-deliveries',
  auth,
  allowRoles('STAFF'),
  getAvailableDeliveries
);

router.get(
  '/my-jobs',
  auth,
  allowRoles('STAFF'),
  getMyJobs
);

// ── POST routes ─────────────────────────
router.post(
  '/:id/assign',
  auth,
  allowRoles('STAFF'),
  assignJob
);

// ── PATCH routes ─────────────────────────
router.patch(
  '/:id/status',
  auth,
  allowRoles('STAFF'),
  validateUpdateStatus,
  updateJobStatus
);

router.patch(
  '/:id/location',
  auth,
  allowRoles('STAFF'),
  validateUpdateLocation,
  updateLocation
);


router.get(
  '/admin/delivery-dashboard',
  auth,
  allowRoles('ADMIN', 'STAFF'),
  getDeliveryDashboard
);

export default router;