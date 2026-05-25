import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  status: {
    type: String,
    default: 'SUBMITTED' // e.g. SUBMITTED, APPLIED, APPROVED
  },
  admitCardUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Ensure a user can only apply to an exam once (compound index)
applicationSchema.index({ userId: 1, exam: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
