import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as serviceService from './service.js';
import { ApiResponse } from '../../core/apiResponse.js';
import ApiError from '../../core/apiError.js';

export const createServiceCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const category = await serviceService.createServiceCategory(req.body);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getServiceCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await serviceService.getServiceCategories();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateServiceCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await serviceService.updateServiceCategory(req.params.id as string, req.body);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteServiceCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await serviceService.deleteServiceCategory(req.params.id as string);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const service = await serviceService.createService(req.body);
        res.status(201).json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getServices = async (req: Request, res: Response): Promise<void> => {
    try {
        const services = await serviceService.getServices();
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await serviceService.updateService(req.params.id as string, req.body);
        if (!service) {
            res.status(404).json({ message: 'Service not found' });
            return;
        }
        res.json(service);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
    try {
        const service = await serviceService.deleteService(req.params.id as string);
        if (!service) {
            res.status(404).json({ message: 'Service not found' });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const order = await serviceService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filters = {
            status: req.query.status,
            serviceMode: req.query.serviceMode,
            finishingType: req.query.finishingType
        };
        const result = await serviceService.getOrders(page, limit, filters);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await serviceService.updateOrder(req.params.id as string, req.body);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await serviceService.deleteOrder(req.params.id as string);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePricing = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await serviceService.pricingUpdated(req.params.orderId as string, req.body);
        ApiResponse(res, 200, 'Pricing updated successfully', order);
    } catch (error: any) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};