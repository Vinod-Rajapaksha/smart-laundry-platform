import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportType: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    periodFrom: { 
        type: Date, 
        required: true, 
    },
    periodTo: { 
        type: Date, 
        required: true, 
    },
    generatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Report', reportSchema);