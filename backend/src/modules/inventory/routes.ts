import { Router } from 'express';
import { InventoryController } from './controller.js';

const router = Router();

// Categories
router.get('/categories', InventoryController.getCategories);
router.post('/categories', InventoryController.createCategory);
router.delete('/categories/:name', InventoryController.deleteCategory);

// Items
router.get('/items', InventoryController.getItems);
router.post('/items', InventoryController.createItem);
router.put('/items/:id', InventoryController.updateItem);
router.delete('/items/:id', InventoryController.deleteItem);

export default router;
