import { Router } from 'express';
import * as controller from './controller.js';
import * as validation from './validation.js';

const router = Router();

// Service Categories Routes
router.post('/categories', validation.validateServiceCategory, controller.createServiceCategory);
router.get('/categories', controller.getServiceCategories);
router.put('/categories/:id', validation.validateServiceCategory, controller.updateServiceCategory);
router.delete('/categories/:id', controller.deleteServiceCategory);

// Order Routes
router.post('/orders', validation.validateOrder, controller.createOrder);
router.get('/orders', controller.getOrders);
router.put('/orders/:id', validation.validateOrderUpdate, controller.updateOrder);
router.delete('/orders/:id', controller.deleteOrder);

// Services Routes
router.post('/', validation.validateService, controller.createService);
router.get('/', controller.getServices);
router.put('/:id', validation.validateService, controller.updateService);
router.delete('/:id', controller.deleteService);

export default router;