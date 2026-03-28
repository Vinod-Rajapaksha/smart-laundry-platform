import { Response } from 'express';
import { AuthRequest } from '../../types/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';
import * as orderService from './service.js';

// ─────────────────────────────────────────
// 1. GET /orders/available-pickups
// ─────────────────────────────────────────
export const getAvailablePickups = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await orderService.getAvailablePickups();
    return ApiResponse(res, 200, 'Available pickups fetched', orders);
  }
);

// ─────────────────────────────────────────
// 2. GET /orders/available-deliveries
// ─────────────────────────────────────────
export const getAvailableDeliveries = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orders = await orderService.getAvailableDeliveries();
    return ApiResponse(res, 200, 'Available deliveries fetched', orders);
  }
);

// ─────────────────────────────────────────
// 3. POST /orders/:id/assign
// ─────────────────────────────────────────
export const assignJob = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const staffId = req.user!.id;
    const { jobType } = req.body as { jobType: 'PICKUP' | 'DELIVERY' };

    const job = await orderService.assignJob(orderId, staffId, jobType);
    return ApiResponse(res, 201, 'Job assigned successfully', job);
  }
);

// ─────────────────────────────────────────
// 4. GET /orders/my-jobs
// ─────────────────────────────────────────
export const getMyJobs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const staffId = req.user!.id;
    const jobs = await orderService.getMyJobs(staffId);
    return ApiResponse(res, 200, 'Your active jobs fetched', jobs);
  }
);

// ─────────────────────────────────────────
// 5. PATCH /orders/:id/status
// ─────────────────────────────────────────
export const updateJobStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const staffId = req.user!.id;
    const { status } = req.body as { status: string };

    const updatedOrder = await orderService.updateJobStatus(
      orderId,
      staffId,
      status
    );
    return ApiResponse(res, 200, 'Status updated successfully', updatedOrder);
  }
);

// ─────────────────────────────────────────
// 6. PATCH /orders/:id/location
// ─────────────────────────────────────────
export const updateLocation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orderId = req.params.id as string;
    const staffId = req.user!.id;
    const { latitude, longitude } = req.body as {
      latitude: number;
      longitude: number;
    };

    const updatedOrder = await orderService.updateLocation(
      orderId,
      staffId,
      latitude,
      longitude
    );
    return ApiResponse(res, 200, 'Location updated successfully', updatedOrder);
  }
);



// ─────────────────────────────────────────
// 7. GET /orders/admin/delivery-dashboard
//    Admin sees all delivery orders
// ─────────────────────────────────────────
export const getDeliveryDashboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = await orderService.getDeliveryDashboard();
    return ApiResponse(res, 200, 'Delivery dashboard fetched', data);
  }
);