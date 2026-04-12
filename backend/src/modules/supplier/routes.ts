import { Router } from 'express';
import { 
  createSupplier, 
  getAllSuppliers, 
  getSupplierById, 
  updateSupplier, 
  deleteSupplier,
  confirmRestock,
  notifyLowStock
} from './controller.js';

const router = Router();

// Webhook route - needs to be accessible via GET from email clicks
router.get('/confirm-restock', confirmRestock);

// Integration Webhook from Inventory Service
router.post('/notify-low-stock', notifyLowStock);

// Standard CRUD
router.post('/', createSupplier);
router.get('/', getAllSuppliers);
router.get('/:id', getSupplierById);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;
