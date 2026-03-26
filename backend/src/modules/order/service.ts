import Order from '../../database/models/Order.js';
import StaffJob from '../../database/models/StaffJob.js';
import ApiError from '../../core/apiError.js';

// ─────────────────────────────────────────
// 1. Get all orders available for pickup
// ─────────────────────────────────────────
export const getAvailablePickups = async () => {
  const orders = await Order.find({ status: 'PENDING' })
    .populate('userId', 'name email telephone')
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

// ─────────────────────────────────────────
// 2. Get all orders available for delivery
// ─────────────────────────────────────────
export const getAvailableDeliveries = async () => {
  const orders = await Order.find({ status: 'READY' })
    .populate('userId', 'name email telephone')
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};

// ─────────────────────────────────────────
// 3. Assign a job to the rider
// ─────────────────────────────────────────
export const assignJob = async (
  orderId: string,
  staffId: string,
  jobType: 'PICKUP' | 'DELIVERY'
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (jobType === 'PICKUP' && order.status !== 'PENDING') {
    throw new ApiError(400, 'Order is not available for pickup');
  }

  if (jobType === 'DELIVERY' && order.status !== 'READY') {
    throw new ApiError(400, 'Order is not available for delivery');
  }

  const existingJob = await StaffJob.findOne({
    orderId,
    jobType,
    jobStatus: { $in: ['PENDING', 'IN_PROGRESS'] },
  });

  if (existingJob) {
    throw new ApiError(400, 'This order already has an active rider assigned');
  }

  const job = await StaffJob.create({
    orderId,
    jobType,
    assignedStaffId: staffId,
    jobStatus: 'PENDING',
  });

  const newStatus = jobType === 'PICKUP'
    ? 'PICKUP_ASSIGNED'
    : 'DELIVERY_ASSIGNED';

  await Order.findByIdAndUpdate(orderId, {
    status: newStatus,
    updateBy: staffId,
  });

  return job;
};

// ─────────────────────────────────────────
// 4. Get all active jobs for this rider
// ─────────────────────────────────────────
export const getMyJobs = async (staffId: string) => {
  const jobs = await StaffJob.find({
    assignedStaffId: staffId,
    jobStatus: { $in: ['PENDING', 'IN_PROGRESS'] },
  })
    .populate({
      path: 'orderId',
      populate: [
        { path: 'userId', select: 'name email telephone' },
      ],
    })
    .sort({ createdAt: -1 })
    .lean();

  return jobs;
};

// ─────────────────────────────────────────
// 5. Update the status of a job
// ─────────────────────────────────────────
export const updateJobStatus = async (
  orderId: string,
  staffId: string,
  status: string
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const job = await StaffJob.findOne({
    orderId,
    assignedStaffId: staffId,
    jobStatus: { $in: ['PENDING', 'IN_PROGRESS'] },
  });

  if (!job) {
    throw new ApiError(404, 'No active job found for this order');
  }

  const isJobComplete = status === 'PICKED_UP' || status === 'DELIVERED';

  await Order.findByIdAndUpdate(orderId, {
    status,
    updateBy: staffId,
  });

  await StaffJob.findByIdAndUpdate(job._id, {
    jobStatus: isJobComplete ? 'COMPLETED' : 'IN_PROGRESS',
    ...(isJobComplete ? { completedAt: new Date() } : {}),
    ...(job.jobStatus === 'PENDING' ? { startedAt: new Date() } : {}),
  });

  const updatedOrder = await Order.findById(orderId)
    .populate('userId', 'name email telephone')
    .lean();

  return updatedOrder;
};

// ─────────────────────────────────────────
// 6. Update GPS location
// ─────────────────────────────────────────
export const updateLocation = async (
  orderId: string,
  staffId: string,
  latitude: number,
  longitude: number
) => {
  const job = await StaffJob.findOne({
    orderId,
    assignedStaffId: staffId,
    jobStatus: 'IN_PROGRESS',
  });

  if (!job) {
    throw new ApiError(403, 'You do not have an active job on this order');
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      riderLatitude: latitude,
      riderLongitude: longitude,
    },
    { new: true }
  ).lean();

  return updatedOrder;
};