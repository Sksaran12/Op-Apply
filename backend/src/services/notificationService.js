import { sendMail } from '../config/mailer.js';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

// Base HTML wrapper to keep templates responsive and themed with Saffron/Navy
const emailWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Nunito', sans-serif; background-color: #070B1E; color: #e0e3e5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #101415; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 30px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }
    .header { text-align: center; border-bottom: 2px solid #FF9933; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { font-family: 'Rajdhani', sans-serif; color: #FF9933; margin: 0; font-size: 28px; text-transform: uppercase; }
    .content { line-height: 1.6; font-size: 16px; color: #e0e3e5; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { background-color: #FF9933; color: #070B1E; padding: 12px 30px; font-weight: bold; border-radius: 4px; text-decoration: none; display: inline-block; font-family: 'Rajdhani', sans-serif; font-size: 16px; text-transform: uppercase; }
    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #919097; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>OP.Apply</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message from OP.Apply portal.</p>
      <p>© 2026 National Testing Agency, Ministry of Education, India</p>
    </div>
  </div>
</body>
</html>
`;

export const notificationService = {
  // 1. Account registration
  sendWelcomeEmail: async (userEmail, fullName) => {
    const content = `
      <p>Hello ${fullName},</p>
      <p>Welcome to <strong>OP.Apply</strong> — India's unified competitive examination portal.</p>
      <p>Your single dashboard allows you to apply for major national-level exams such as NEET, JEE, UGC NET, SLET, SSC, and APSC in just a single click.</p>
      <p>Please log in to your account and complete your academic profile to get started.</p>
    `;
    await sendMail({
      to: userEmail,
      subject: 'Welcome to OP.Apply Portal!',
      html: emailWrapper('Welcome to OP.Apply', content)
    });
  },

  // 2. Email verification
  sendVerificationEmail: async (userEmail, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
    const content = `
      <p>Hello,</p>
      <p>Thank you for registering on OP.Apply. Please verify your email address to activate your unified applicant profile.</p>
      <div class="button-container">
        <a href="${verifyUrl}" class="button">Verify Email</a>
      </div>
      <p>If the button doesn't work, click the link below or copy it to your browser:</p>
      <p><a href="${verifyUrl}" style="color: #FF9933;">${verifyUrl}</a></p>
    `;
    await sendMail({
      to: userEmail,
      subject: 'Verify Your OP.Apply Email',
      html: emailWrapper('Verify Your Email Address', content)
    });
  },

  // 3. Password reset (15-min expiry)
  sendPasswordResetEmail: async (userEmail, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const content = `
      <p>Hello,</p>
      <p>You requested a password reset for your OP.Apply account.</p>
      <p><strong>This password reset link is valid for 15 minutes only.</strong></p>
      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email. Your account password will remain secure.</p>
    `;
    await sendMail({
      to: userEmail,
      subject: 'Reset Your OP.Apply Password (15-Min Expiry)',
      html: emailWrapper('Password Reset Request', content)
    });
  },

  // 4. Application submitted
  sendApplicationSubmittedEmail: async (userEmail, fullName, examName, appNumber) => {
    const content = `
      <p>Hello ${fullName},</p>
      <p>Your application for <strong>${examName}</strong> has been successfully registered as <strong>Applied</strong> via the official main office website.</p>
      <p><strong>Reference Number:</strong> ${appNumber}</p>
      <p>You can track updates and retrieve hall tickets from your OP.Apply command center dashboard.</p>
    `;
    await sendMail({
      to: userEmail,
      subject: `Application Registered - ${examName}`,
      html: emailWrapper('Application Registered as Applied', content)
    });
  },

  // 5. Application approved
  sendApplicationApprovedEmail: async (userEmail, fullName, examName) => {
    const content = `
      <p>Hello ${fullName},</p>
      <p>Good news! Your credentials and documents submitted for <strong>${examName}</strong> have been reviewed and approved.</p>
      <p>Your hall ticket and admit card will be issued shortly as the exam date approaches.</p>
    `;
    await sendMail({
      to: userEmail,
      subject: `Application Approved - ${examName}`,
      html: emailWrapper('Application Approved', content)
    });
  },

  // 6. Admit card available
  sendAdmitCardIssuedEmail: async (userEmail, fullName, examName) => {
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`;
    const content = `
      <p>Hello ${fullName},</p>
      <p>Your Admit Card (Hall Ticket) for <strong>${examName}</strong> is now available for download!</p>
      <p>Please log in to your dashboard to obtain the PDF copy. You must print and carry it to the designated test center.</p>
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
      </div>
    `;
    await sendMail({
      to: userEmail,
      subject: `Admit Card Available - ${examName}`,
      html: emailWrapper('Admit Card Issued', content)
    });
  },

  // 7. Result declared
  sendResultDeclaredEmail: async (userEmail, fullName, examName) => {
    const resultsUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`;
    const content = `
      <p>Hello ${fullName},</p>
      <p>The results for the examination <strong>${examName}</strong> have been officially declared!</p>
      <p>Login to your OP.Apply profile to view your scores, rank card, and counseling schedule.</p>
      <div class="button-container">
        <a href="${resultsUrl}" class="button">View Results</a>
      </div>
    `;
    await sendMail({
      to: userEmail,
      subject: `Results Declared - ${examName}`,
      html: emailWrapper('Results Declared', content)
    });
  },

  // 8. Deadline reminder (3 days before)
  sendDeadlineReminderEmail: async (userEmail, fullName, examName, daysRemaining = 3) => {
    const content = `
      <p>Hello ${fullName},</p>
      <p>This is an urgent reminder that the application deadline for <strong>${examName}</strong> is closing in <strong>${daysRemaining} days</strong>.</p>
      <p>Please ensure all document uploads are finalized and payment completed from your universal portal dashboard to avoid late submissions.</p>
      <div class="button-container">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Complete Application</a>
      </div>
    `;
    await sendMail({
      to: userEmail,
      subject: `Urgent: ${examName} Deadline in ${daysRemaining} Days`,
      html: emailWrapper('Application Deadline Closing Soon', content)
    });
  }
};

// Simple background service representing cron scheduler for deadline reminders
export const startDeadlineReminderCron = () => {
  console.log('[Scheduler] Initializing 3-day exam deadline reminder task...');
  
  // Setup interval to check every hour in background (simulated cron task)
  setInterval(async () => {
    try {
      const now = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);
      
      // Get exams closing in exactly ~3 days
      const targetDateStart = new Date(threeDaysLater.setHours(0, 0, 0, 0));
      const targetDateEnd = new Date(threeDaysLater.setHours(23, 59, 59, 999));
      
      const closingExams = await Exam.find({
        endDate: {
          $gte: targetDateStart,
          $lte: targetDateEnd
        }
      });
      
      for (const exam of closingExams) {
        // Find users who have applied for this exam
        const appliedUsers = await Application.find({ exam: exam._id }).distinct('userId');

        // Find users who have NOT applied for this exam
        const users = await User.find({
          _id: { $nin: appliedUsers }
        }).populate('profile');
        
        for (const user of users) {
          if (!user.profile) continue; // Skip users without profiles
          
          console.log(`[Scheduler] Sending deadline reminder for ${exam.code} to ${user.email}`);
          await notificationService.sendDeadlineReminderEmail(
            user.email,
            user.profile?.fullName || 'Candidate',
            exam.name,
            3
          );
          
          // Create database notification record
          await Notification.create({
            userId: user._id,
            title: `${exam.code} Deadline Reminder`,
            message: `The registration window for ${exam.code} closes in 3 days. Apply now!`
          });
        }
      }
    } catch (error) {
      console.error('[Scheduler Error] Failed checking deadlines:', error);
    }
  }, 1000 * 60 * 60); // run hourly
};

export default notificationService;
