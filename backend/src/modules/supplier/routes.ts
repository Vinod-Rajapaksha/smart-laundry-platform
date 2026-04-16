import { Router } from 'express';
import { SupplierController } from './controller.js';

const router = Router();

router.get('/', SupplierController.getSuppliers);
router.get('/notifications', SupplierController.getNotifications);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
