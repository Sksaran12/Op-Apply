import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true // General, OBC, SC, ST, EWS
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: null
  },
  signatureUrl: {
    type: String,
    default: null
  },
  highSchoolMarks: {
    type: Number,
    required: true,
    default: 0
  },
  higherSecondaryMarks: {
    type: Number,
    required: true,
    default: 0
  },
  board: {
    type: String,
    default: ''
  },
  graduationMarks: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
