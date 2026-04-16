import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './service.js';
import { ApiResponse } from '../../core/apiResponse.js';
import ApiError from '../../core/apiError.js';
import { validateInventoryPayload } from './validation.js';

export class InventoryController {
    // --- Categories ---
    static async getCategories(_req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await InventoryService.getCategories();
            return ApiResponse(res, 200, "Categories retrieved", categories.map(c => c.name));
        } catch (error) {
            next(error);
        }
    }

    static async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            if (!name) throw new ApiError(400, "Category name is required");
            const category = await InventoryService.createCategory(name);
            return ApiResponse(res, 201, "Category created", category);
        } catch (error: any) {
            if (error.code === 11000) next(new ApiError(400, "Category already exists"));
            else next(error);
        }
    }

    static async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.params.name as string;
            await InventoryService.deleteCategory(name);
            return ApiResponse(res, 200, "Category deleted");
        } catch (error) {
            next(error);
        }
    }

    // --- Items ---
    static async getItems(_req: Request, res: Response, next: NextFunction) {
        try {
            const items = await InventoryService.getItems();
            const mapped = items.map(i => {
                const obj = i.toObject();
                return { ...obj, id: obj.itemId };
            });
            return ApiResponse(res, 200, "Items retrieved", mapped);
        } catch (error) {
            next(error);
        }
    }

    static async createItem(req: Request, res: Response, next: NextFunction) {
        try {
            const val = validateInventoryPayload(req.body);
            if (!val.isValid) throw new ApiError(400, "Validation failed", val.errors);

            const payload = { ...req.body, itemId: req.body.id };
            const item = await InventoryService.createItem(payload);
            return ApiResponse(res, 201, "Item created", { ...item.toObject(), id: item.itemId });
        } catch (error: any) {
            if (error.code === 11000) next(new ApiError(400, "Item ID already exists"));
            else next(error);
        }
    }

    static async updateItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const val = validateInventoryPayload(req.body);
            if (!val.isValid) throw new ApiError(400, "Validation failed", val.errors);

            const item = await InventoryService.updateItem(id, req.body);
            if (!item) throw new ApiError(404, "Item not found");
            return ApiResponse(res, 200, "Item updated", { ...item.toObject(), id: item.itemId });
        } catch (error) {
            next(error);
        }
    }

    static async deleteItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            await InventoryService.deleteItem(id);
            return ApiResponse(res, 200, "Item deleted");
        } catch (error) {
            next(error);
        }
    }

    static async deductStock(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const { amount, unit } = req.body;

            if (amount === undefined || !unit) {
                throw new ApiError(400, "amount and unit are required");
            }

            const item = await InventoryService.deductStock(id, Number(amount), String(unit));
            return ApiResponse(res, 200, "Stock deducted successfully", { ...item.toObject(), id: item.itemId });
        } catch (error: any) {
            if (error.message.includes("Insufficient stock") || error.message.includes("Unit mismatch") || error.message.includes("Unknown unit")) {
                next(new ApiError(400, error.message));
            } else if (error.message.includes("Item not found")) {
                next(new ApiError(404, error.message));
            } else {
                next(error);
            }
        }
    }

    static async restockItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const { amount, unit } = req.body;

            if (amount === undefined || !unit) {
                throw new ApiError(400, "amount and unit are required");
            }

            const item = await InventoryService.restockItem(id, Number(amount), String(unit));
            return ApiResponse(res, 200, "Item restocked successfully", { ...item.toObject(), id: item.itemId });
        } catch (error: any) {
            if (error.message.includes("Unit mismatch") || error.message.includes("Unknown unit")) {
                next(new ApiError(400, error.message));
            } else if (error.message.includes("Item not found")) {
                next(new ApiError(404, error.message));
            } else {
                next(error);
            }
        }
    }

    static async getRecentDeductionsCount(_req: Request, res: Response, next: NextFunction) {
        try {
            const count = await InventoryService.getRecentDeductionsCount();
            return ApiResponse(res, 200, "Recent deductions count retrieved", { count });
        } catch (error) {
            next(error);
        }
    }
}
