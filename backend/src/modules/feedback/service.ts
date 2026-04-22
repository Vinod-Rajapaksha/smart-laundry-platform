import mongoose from 'mongoose';
import ApiError from '../../core/apiError.js';
import { FEEDBACK_STATUS, MESSAGES } from '../../core/constants.js';
import { getPagination } from '../../core/pagination.js';
import Feedback from '../../database/models/Feedback.js';
import Order from '../../database/models/Order.js';

interface CreateFeedbackInput {
  orderId: string;
  rating: number;
  comment?: string | null;
  suggestions?: string | null;
  tags?: string[];
}

interface GetFeedbacksQuery {
   page?: string;
  limit?: string;
  status?: string;
  hasSuggestions?: string;
}

interface UpdateMyFeedbackInput {
  rating?: number;
  comment?: string | null;
  suggestions?: string | null;
  tags?: string[];
}

export const createFeedback = async (userId: string, input: CreateFeedbackInput) => {

  const order = await Order.findOne({
    _id: input.orderId,
    userId,
  });

  if (!order) {
    throw new ApiError(404, 'Order not found or does not belong to you');
  }

  if (order.status !== 'completed') {
    throw new ApiError(400, 'Feedback can only be given for completed orders');
  }

 const existing = await Feedback.findOne({ orderId: input.orderId });
  if (existing) {
    throw new ApiError(409, 'Feedback has already been submitted for this order');
  }

  const normalizedTags = input.tags ? [...new Set(input.tags)] : [];

  const feedback = await Feedback.create({
    orderId: input.orderId,
    userId,
    rating: input.rating,
    comment: input.comment ?? null,
    suggestions: input.suggestions ?? null,
    tags: normalizedTags,
    status: FEEDBACK_STATUS.PENDING,
  });

  return feedback;
};

export const getAllFeedbacks = async (query: GetFeedbacksQuery) => {
  const { page, limit, status ,hasSuggestions} = query;
  const { page: currentPage, limit: perPage, skip } = getPagination(page, limit);

  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (hasSuggestions === 'true') {
    filter.suggestions = { $nin: [null, ''] };
  }
  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
       .populate('userId', 'name ')
      .populate('orderId', 'orderNo ')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),
    Feedback.countDocuments(filter),
  ]);

  return {
    feedbacks,
    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
};

export const updateMyFeedback = async (
  userId: string,
  feedbackId: string,
  input: UpdateMyFeedbackInput,
) => {
  if (!mongoose.isValidObjectId(feedbackId)) {
    throw new ApiError(400, 'Invalid feedback ID');
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,
    userId,
  });

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found or does not belong to you');
  }

  if (feedback.status !== FEEDBACK_STATUS.PENDING) {
    throw new ApiError(400, 'Only pending feedback can be updated');
  }

  if (input.rating !== undefined) {
    feedback.rating = input.rating;
  }

  if (input.comment !== undefined) {
    feedback.comment = input.comment ?? null;
  }

  if (input.suggestions !== undefined) {
    feedback.suggestions = input.suggestions ?? null;
  }

  if (input.tags !== undefined) {
    feedback.tags = [...new Set(input.tags)];
  }

  await feedback.save();

  return await Feedback.findById(feedback._id)
    .populate('orderId', 'orderNo')
    .lean();
};

export const deleteMyFeedback = async (userId: string, feedbackId: string) => {
  if (!mongoose.isValidObjectId(feedbackId)) {
    throw new ApiError(400, 'Invalid feedback ID');
  }

  const feedback = await Feedback.findOne({
    _id: feedbackId,
    userId,
  });

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found or does not belong to you');
  }

  if (feedback.status !== FEEDBACK_STATUS.PENDING) {
    throw new ApiError(400, 'Only pending feedback can be deleted');
  }

  await Feedback.findByIdAndDelete(feedbackId);

  return {
    deleted: true,
    feedbackId,
  };
};

export const getFeedbackById = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid feedback ID');
  }

  const feedback = await Feedback.findById(id)
    .populate('userId', 'name ')
    .populate('orderId', 'orderNo');

  if (!feedback) {
    throw new ApiError(404, MESSAGES.NOT_FOUND);
  }

  return feedback;
};

export const updateFeedbackStatus = async (
  id: string,
  status: string,
) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid feedback ID');
  }
  const feedback = await Feedback.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  )
    .populate('userId', 'name')
    .populate('orderId', 'orderNo');

  if (!feedback) {
    throw new ApiError(404, MESSAGES.NOT_FOUND);
  }

  return feedback;
};

export const deleteFeedbackAdmin = async (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid feedback ID');
  }

  const feedback = await Feedback.findByIdAndDelete(id);

  if (!feedback) {
    throw new ApiError(404, MESSAGES.NOT_FOUND);
  }

  return {
    deleted: true,
    feedbackId: id,
  };
};

export const getFeedbackStats = async () => {
  const [result] = await Feedback.aggregate([
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalReviews: { $sum: 1 },
              averageRating: { $avg: '$rating' },
            },
          },
        ],
        approvedOnly: [
          { $match: { status: FEEDBACK_STATUS.APPROVED } },
          {
            $group: {
              _id: null,
              totalApproved: { $sum: 1 },
              approvedAverageRating: { $avg: '$rating' },
            },
          },
        ],
        ratingDistribution: [
          { $match: { status: FEEDBACK_STATUS.APPROVED } },
          { $group: { _id: '$rating', count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        statusBreakdown: [
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  return {
    totalReviews: result.overall[0]?.totalReviews ?? 0,
    averageRating: Number((result.overall[0]?.averageRating ?? 0).toFixed(1)),
    totalApproved: result.approvedOnly[0]?.totalApproved ?? 0,
    approvedAverageRating: Number(
      (result.approvedOnly[0]?.approvedAverageRating ?? 0).toFixed(1),
    ),
    ratingDistribution: result.ratingDistribution as { _id: number; count: number }[],
    statusBreakdown: result.statusBreakdown as { _id: string; count: number }[],
  };
};

export const getApprovedFeedbacks = async (limit = 10) => {
  const { limit: perPage } = getPagination(1, limit);

  const feedbacks = await Feedback.find({ status: FEEDBACK_STATUS.APPROVED })
    .populate('userId', 'name')
    .populate('orderId', 'orderNo')
    .select('rating comment tags createdAt userId orderId')
    .sort({ createdAt: -1 })
    .limit(perPage)
    .lean();

  return feedbacks;
};

export const getFeedbackSummary = async () => {
  const { getSetting } = await import('../settings/service.js');
  const isEnabled = await getSetting('ai_summary_enabled', true);

  if (!isEnabled) {
    return { summary: '', sentiment: 'neutral' };
  }

  const feedbacks = await Feedback.find({ 
    status: FEEDBACK_STATUS.APPROVED,
    comment: { $nin: [null, ''] }
  })
    .select('comment')
    .limit(20)
    .lean();

  const comments = feedbacks.map((f) => f.comment as string);
  
  if (comments.length === 0) {
    return { summary: '', sentiment: 'neutral' };
  }

  const { generateReviewSummary } = await import('../../utils/ai.service.js');
  const summary = await generateReviewSummary(comments);

  return {
    summary,
    sentiment: 'positive',
    count: comments.length
  };
};

export const getMyFeedbackForOrder = async (userId: string, orderId: string) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, 'Invalid order ID');
  }

  const feedback = await Feedback.findOne({ userId, orderId })
    .populate('orderId', 'orderNo')
    .lean();

  return feedback ?? null;
};

export const getMyAllFeedbacks = async (userId: string) => {
  const feedbacks = await Feedback.find({ userId })
    .populate('orderId', 'orderNo')
    .sort({ createdAt: -1 })
    .lean();

  return feedbacks;
};