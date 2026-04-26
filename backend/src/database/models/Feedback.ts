import mongoose from 'mongoose';
import { FEEDBACK_STATUS, FEEDBACK_TAGS } from '../../core/constants.js';

const feedbackSchema = new mongoose.Schema(
  {
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true, 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5, 
    },
   status: { 
        type: String,
        enum: Object.values(FEEDBACK_STATUS),
        default: FEEDBACK_STATUS.PENDING,
        required: true,
    },
    comment: { 
        type: String, 
        default: null, 
        trim: true, 
    },
    suggestions: { 
        type: String, 
        default: null, 
        trim: true, 
    },
    tags: {
        type: [String],
        enum: Object.values(FEEDBACK_TAGS),
        default: [],
    }
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Feedback', feedbackSchema);