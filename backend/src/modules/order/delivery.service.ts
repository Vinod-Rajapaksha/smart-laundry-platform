import StaffJob from '../../database/models/StaffJob.js';
import ApiError from '../../core/apiError.js';
import { LOGISTICS_JOB_STATUS } from '../../core/constants.js';

export const getDeliveryJobs = async (query: any) => {
  const { status } = query;
  const filter: any = {};
  if (status) filter.jobStatus = status;

  return await StaffJob.find(filter)
    .sort({ createdAt: -1 })
    .populate('orderId')
    .populate('assignedStaffId', 'name email telephone avatar');
};

export const updateJobStatus = async (id: string, status: string) => {
  const job = await StaffJob.findById(id);
  if (!job) throw new ApiError(404, 'Job not found');

  job.jobStatus = status;
  if (status === LOGISTICS_JOB_STATUS.STARTED) {
    job.startedAt = new Date();
  } else if (status === LOGISTICS_JOB_STATUS.COMPLETED) {
    job.completedAt = new Date();
  }

  await job.save();
  return job;
};

export const createJobFromOrder = async (orderId: string, staffId: string, jobType: string) => {
  const job = await StaffJob.create({
    orderId,
    assignedStaffId: staffId,
    jobType,
    jobStatus: LOGISTICS_JOB_STATUS.PENDING
  });
  return job;
};
