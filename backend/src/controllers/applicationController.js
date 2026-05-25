import PDFDocument from 'pdfkit';
import Exam from '../models/Exam.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import notificationService from '../services/notificationService.js';

export const submitApplication = async (req, res) => {
  const { examId } = req.body;

  if (!examId) {
    return res.status(400).json({ message: 'Exam ID is required' });
  }

  try {
    // 1. Find Exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // 2. Check if user profile is complete
    const user = await User.findById(req.user._id).populate('profile');

    if (!user.profile || !user.profile.fullName || !user.profile.phone || !user.profile.address || !user.profile.board || !user.profile.highSchoolMarks || !user.profile.higherSecondaryMarks || !user.profile.photoUrl || !user.profile.signatureUrl) {
      return res.status(400).json({
        message: 'Please complete all required fields (Name, Phone, Address, Class 10 & 12 Marks, Photo, and Signature) in your profile tab before applying.'
      });
    }

    // 3. Check for highest educational details for graduate/PG level exams
    const pgExams = ['UGC_NET', 'SLET', 'APSC'];
    if (pgExams.includes(exam.code) && !user.profile.graduationMarks) {
      return res.status(400).json({
        message: `The ${exam.code} examination requires higher academic details. Please fill in your Graduation Marks in your profile tab first.`
      });
    }

    // 4. Check if application already exists for this user and exam
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      exam: examId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this examination.' });
    }

    // Check if application window is open
    const now = new Date();
    if (now < exam.startDate || now > exam.endDate) {
      return res.status(400).json({ message: 'The application window for this exam is currently closed.' });
    }

    // 4. Generate unique application number
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const applicationNumber = `OP-${exam.code}-${randomHex}`;

    // 5. Create Application
    const application = new Application({
      applicationNumber,
      userId: req.user._id,
      exam: examId,
      status: 'APPLIED'
    });
    await application.save();

    const applicationWithExam = await Application.findById(application._id).populate('exam');

    // 6. Send application submit notification
    notificationService.sendApplicationSubmittedEmail(
      user.email,
      user.profile.fullName,
      exam.name,
      applicationNumber
    ).catch(console.error);

    await Notification.create({
      userId: req.user._id,
      title: 'Application Registered',
      message: `Your application for ${exam.name} (${applicationNumber}) has been registered as Applied from the official main office website.`
    });

    return res.status(201).json({
      message: 'Application registered successfully',
      application: applicationWithExam
    });
  } catch (error) {
    console.error('[Submit Application Error]', error);
    return res.status(500).json({ message: 'Server error submitting application' });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('exam')
      .sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    console.error('[Get Applications Error]', error);
    return res.status(500).json({ message: 'Server error retrieving applications' });
  }
};

export const downloadAdmitCard = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Application.findById(id)
      .populate('exam')
      .populate({
        path: 'userId',
        populate: { path: 'profile' }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const userObj = application.userId;

    if (userObj._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Allow downloading only if approved or admit card issued
    if (application.status !== 'ADMIT_CARD_ISSUED' && application.status !== 'APPROVED') {
      return res.status(400).json({
        message: 'Your admit card is pending verification. Current status: ' + application.status
      });
    }

    // Initialize PDFKit Document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=AdmitCard_${application.exam.code}_${application.applicationNumber}.pdf`);

    // Stream PDF directly to client response
    doc.pipe(res);

    // Outer Border
    doc.rect(20, 20, 572, 752).strokeColor('#FF9933').lineWidth(3).stroke();

    // Saffron Header
    doc.rect(20, 20, 572, 60).fill('#070B1E');
    doc.fillColor('#FF9933').fontSize(24).font('Helvetica-Bold').text('OP.APPLY PORTAL', 20, 38, { align: 'center', width: 572 });
    doc.fontSize(10).fillColor('#138808').text('Unified Examination Admissions Card', 20, 64, { align: 'center', width: 572 });

    doc.moveDown(4);

    // Exam Name Info
    doc.fillColor('#070B1E').fontSize(16).font('Helvetica-Bold').text(application.exam.name.toUpperCase(), { align: 'center' });
    doc.fontSize(12).fillColor('#FF9933').text(`Exam Code: ${application.exam.code} | Session: 2026`, { align: 'center' });
    doc.moveDown(1.5);

    // Horizontal Divider
    doc.moveTo(40, 175).lineTo(552, 175).strokeColor('#E0E3E5').lineWidth(1).stroke();

    // Content Split: Candidate Details vs Exam Details
    doc.fillColor('#070B1E');
    
    // Left: Candidate Info
    doc.font('Helvetica-Bold').fontSize(11).text('CANDIDATE PROFILE', 50, 195);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Full Name: ${userObj.profile?.fullName || 'Candidate'}`, 50, 215);
    doc.text(`Email Address: ${userObj.email}`, 50, 230);
    doc.text(`Phone No: ${userObj.profile?.phone || 'N/A'}`, 50, 245);
    doc.text(`Gender: ${userObj.profile?.gender || 'N/A'}`, 50, 260);
    doc.text(`Category Group: ${userObj.profile?.category || 'General'}`, 50, 275);

    // Right: Center & Schedule Info
    doc.font('Helvetica-Bold').fontSize(11).text('HALL TICKET DETAILS', 320, 195);
    doc.font('Helvetica').fontSize(10);
    doc.text(`Roll Number: ${application.applicationNumber}`, 320, 215);
    doc.text(`Exam Date: ${new Date(application.exam.examDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}`, 320, 230);
    doc.text(`Reporting Time: 08:30 AM (IST)`, 320, 245);
    doc.text(`Gate Closure: 09:30 AM (IST)`, 320, 260);
    doc.text(`Venue: NTA National Digital Test Hub, Delhi NCR`, 320, 275);

    doc.moveTo(40, 305).lineTo(552, 305).strokeColor('#E0E3E5').lineWidth(1).stroke();

    // Guidelines Section
    doc.font('Helvetica-Bold').fontSize(11).text('CRITICAL CANDIDATE GUIDELINES', 50, 325);
    doc.font('Helvetica').fontSize(9.5).fillColor('#333333');
    doc.list([
      'Candidates must carry a printed color copy of this Admit Card along with a valid Government Photo ID proof (e.g., Aadhaar, PAN, Voter ID).',
      'Candidates reporting after Gate Closure Time (09:30 AM) will strictly not be permitted to enter the examination venue.',
      'Any electronic devices, mobile phones, smartwatches, calculators, or study materials are completely banned in the test hall.',
      'Ensure the candidate signature matches the records uploaded during profile completion.',
      'Maintain discipline and adhere to all instructions issued by the invigilator during the testing duration.'
    ], 50, 345, { width: 502, lineGap: 5 });

    // Mock Signature Area
    doc.rect(50, 520, 160, 60).strokeColor('#cccccc').lineWidth(1).stroke();
    doc.fontSize(8.5).fillColor('#070B1E').text('Candidate Signature', 50, 590, { width: 160, align: 'center' });

    doc.rect(380, 520, 160, 60).strokeColor('#cccccc').lineWidth(1).stroke();
    doc.fontSize(8.5).fillColor('#070B1E').text('Controller of Examinations (NTA)', 380, 590, { width: 160, align: 'center' });

    // Seal overlay
    doc.circle(460, 550, 22).strokeColor('#138808').lineWidth(1.5).stroke();
    doc.fillColor('#138808').fontSize(6).font('Helvetica-Bold').text('NTA SEAL', 448, 547, { align: 'center', width: 24 });

    // Footer of PDF
    doc.fillColor('#888888').fontSize(8.5).font('Helvetica').text('Generated securely via OP.Apply Unified Applicant Server.', 20, 720, { align: 'center', width: 572 });

    doc.end();
  } catch (error) {
    console.error('[Download Admit Card Error]', error);
    return res.status(500).json({ message: 'Server error downloading admit card PDF' });
  }
};
