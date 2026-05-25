import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  applicationFee: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  signatureColor: {
    type: String,
    required: true
  },
  cardGlowColor: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
