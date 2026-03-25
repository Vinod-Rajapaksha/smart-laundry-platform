import mongoose from 'mongoose';

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
        required: true, 
        trim: true, 
    },
    comment: { 
        type: String, 
        default: null, 
        trim: true, 
    },
    tags: { 
        type: [String], 
        default: [], 
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Feedback', feedbackSchema);