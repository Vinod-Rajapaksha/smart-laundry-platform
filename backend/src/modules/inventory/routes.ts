import { Router } from 'express';
import { InventoryController } from './controller.js';

const router = Router();

// Categories
router.get('/categories', InventoryController.getCategories);
router.post('/categories', InventoryController.createCategory);
router.delete('/categories/:name', InventoryController.deleteCategory);

// Deductions
router.get('/deductions/recent', InventoryController.getRecentDeductionsCount);

// Items
router.get('/items', InventoryController.getItems);
router.post('/items', InventoryController.createItem);
router.put('/items/:id', InventoryController.updateItem);
router.delete('/items/:id', InventoryController.deleteItem);
router.post('/items/:id/deduct', InventoryController.deductStock);
router.post('/items/:id/restock', InventoryController.restockItem);

export default router;
