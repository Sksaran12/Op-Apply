import express from 'express';
import {
  register,
  login,
  googleOAuth,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-oauth', googleOAuth);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email/:token', verifyEmail);

export default router;
