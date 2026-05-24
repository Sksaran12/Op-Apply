import prisma from '../config/db.js';
import { uploadDocument } from '../config/storage.js';

// Helper to calculate profile completion percentage
const calculateCompletion = (profile) => {
  if (!profile) return 0;
  
  let score = 0;
  const items = [
    { field: profile.fullName, weight: 10 },
    { field: profile.dateOfBirth, weight: 10 },
    { field: profile.gender, weight: 10, skipVal: 'Not Specified' },
    { field: profile.category, weight: 10 },
    { field: profile.phone, weight: 10 },
    { field: profile.address, weight: 10 },
    { field: profile.highSchoolMarks, weight: 10, checkZero: true },
    { field: profile.higherSecondaryMarks, weight: 10, checkZero: true },
    { field: profile.board, weight: 10 },
    { field: profile.photoUrl, weight: 5 },
    { field: profile.signatureUrl, weight: 5 }
  ];

  items.forEach(item => {
    if (item.field !== null && item.field !== undefined && item.field !== '') {
      if (item.skipVal && item.field === item.skipVal) return;
      if (item.checkZero && item.field === 0) return;
      score += item.weight;
    }
  });

  return score;
};

export const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const completionPercentage = calculateCompletion(profile);

    return res.json({
      ...profile,
      completionPercentage
    });
  } catch (error) {
    console.error('[Get Profile Error]', error);
    return res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

export const updateProfile = async (req, res) => {
  const {
    fullName,
    dateOfBirth,
    gender,
    category,
    phone,
    address,
    highSchoolMarks,
    higherSecondaryMarks,
    board,
    graduationMarks,
    photoDataUrl, // base64 photo
    signatureDataUrl // base64 signature
  } = req.body;

  try {
    let photoUrl = undefined;
    let signatureUrl = undefined;

    // Handle document upload mocks
    if (photoDataUrl && photoDataUrl.startsWith('data:')) {
      photoUrl = await uploadDocument(photoDataUrl, 'photo.png');
    }
    if (signatureDataUrl && signatureDataUrl.startsWith('data:')) {
      signatureUrl = await uploadDocument(signatureDataUrl, 'signature.png');
    }

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (category !== undefined) updateData.category = category;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (highSchoolMarks !== undefined) updateData.highSchoolMarks = parseFloat(highSchoolMarks);
    if (higherSecondaryMarks !== undefined) updateData.higherSecondaryMarks = parseFloat(higherSecondaryMarks);
    if (board !== undefined) updateData.board = board;
    if (graduationMarks !== undefined) updateData.graduationMarks = graduationMarks ? parseFloat(graduationMarks) : null;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (signatureUrl !== undefined) updateData.signatureUrl = signatureUrl;

    const updatedProfile = await prisma.profile.update({
      where: { userId: req.user.id },
      data: updateData
    });

    const completionPercentage = calculateCompletion(updatedProfile);

    return res.json({
      message: 'Profile updated successfully',
      profile: {
        ...updatedProfile,
        completionPercentage
      }
    });
  } catch (error) {
    console.error('[Update Profile Error]', error);
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};
