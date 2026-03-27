import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
      required: false, 
    },
    generatedByName: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    selectedSections: {
      type: [String],
      default: [],
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Report', reportSchema);