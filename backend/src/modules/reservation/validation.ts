import { body } from 'express-validator';

export const validateServiceCategory = [
    body('name').notEmpty().withMessage('Name is required').isString().trim(),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

export const validateService = [
    body('categoryId').notEmpty().withMessage('Category ID is required').isMongoId().withMessage('Invalid Category ID'),
    body('name').notEmpty().withMessage('Name is required').isString().trim(),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number')
];

export const validateOrder = [
    body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID'),
    body('serviceId').notEmpty().withMessage('Service ID is required').isMongoId().withMessage('Invalid Service ID'),
    body('status').notEmpty().withMessage('Status is required').isString().trim(),
    body('paymentMethod').notEmpty().withMessage('Payment Method is required').isString().trim(),
    body('paymentStatus').notEmpty().withMessage('Payment Status is required').isString().trim(),
    body('weightKg').optional().isNumeric().withMessage('Weight must be a number'),
    body('finishingType').optional().isString(),
    body('serviceMode').optional().isString()
];

export const validateOrderUpdate = [
    body('status').optional().isString().trim(),
    body('paymentStatus').optional().isString().trim()
];