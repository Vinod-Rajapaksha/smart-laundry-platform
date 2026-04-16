import { Request, Response, NextFunction } from 'express';
import { SupplierService } from './service.js';
import { SupplierNotificationModel } from '../../database/models/SupplierNotification.js';
import { ApiResponse } from '../../core/apiResponse.js';
import ApiError from '../../core/apiError.js';

export class SupplierController {
    static async getSuppliers(req: Request, res: Response, next: NextFunction) {
        try {
            const suppliers = await SupplierService.getSuppliers();
            return ApiResponse(res, 200, "Suppliers retrieved", suppliers);
        } catch (error) {
            next(error);
        }
    }

    static async createSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const supplier = await SupplierService.createSupplier(req.body);
            return ApiResponse(res, 201, "Supplier created", supplier);
        } catch (error) {
            next(error);
        }
    }

    static async updateSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const supplier = await SupplierService.updateSupplier(req.params.id, req.body);
            if (!supplier) throw new ApiError(404, "Supplier not found");
            return ApiResponse(res, 200, "Supplier updated", supplier);
        } catch (error) {
            next(error);
        }
    }

    static async deleteSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            await SupplierService.deleteSupplier(req.params.id);
            return ApiResponse(res, 200, "Supplier deleted");
        } catch (error: any) {
            if (error.message === "Supplier not found") {
                next(new ApiError(404, error.message));
            } else {
                next(error);
            }
        }
    }

    static async getNotifications(req: Request, res: Response, next: NextFunction) {
        try {
            const notifications = await SupplierNotificationModel.find()
                .sort({ sentAt: -1 })
                .limit(50);
            return ApiResponse(res, 200, "Notifications retrieved", notifications);
        } catch (error) {
            next(error);
        }
    }
}
