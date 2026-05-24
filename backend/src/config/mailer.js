import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;
const isConfigured =
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_USER !== 'your-email@gmail.com' &&
  process.env.SMTP_PASS !== 'your-app-password';

if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendMail = async ({ to, subject, html, text }) => {
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"ExamSeva Portal" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      });
      console.log(`[Email Sent] MessageID: ${info.messageId} to ${to}`);
      return info;
    } catch (error) {
      console.error('[Email Error] Failed to send email to', to, error);
      return null;
    }
  } else {
    console.log(`
=========================================
[MOCK EMAIL SENT]
To: ${to}
Subject: ${subject}
Text: ${text || 'Check HTML version'}
HTML Preview: ${html.substring(0, 400).replace(/<[^>]*>/g, '').trim()}...
=========================================
    `);
    return { messageId: 'mock-id-' + Math.random() };
  }
};
export default sendMail;
