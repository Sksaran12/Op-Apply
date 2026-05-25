import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Notification from '../models/Notification.js';
import notificationService from '../services/notificationService.js';

// Helpers to generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'op_apply_jwt_secret_key_2026_xyz', {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'op_apply_jwt_refresh_secret_key_2026_abc', {
    expiresIn: '7d'
  });
};

const setCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

export const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, password, and full name are required' });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires
    });
    await newUser.save();

    // Create empty profile details
    const newProfile = new Profile({
      userId: newUser._id,
      fullName,
      dateOfBirth: new Date(),
      gender: 'Not Specified',
      category: 'General',
      phone: '',
      address: '',
      highSchoolMarks: 0,
      higherSecondaryMarks: 0,
      board: ''
    });
    await newProfile.save();

    // Send emails (welcome & verification) in background
    notificationService.sendWelcomeEmail(newUser.email, fullName).catch(console.error);
    notificationService.sendVerificationEmail(newUser.email, verificationToken).catch(console.error);

    // Create database notification with verification link
    await Notification.create({
      userId: newUser._id,
      title: 'Welcome! Verify Your Email',
      message: `Welcome to OP.Apply! Since this is a local development environment, use this link to verify your email directly: verify_token_${verificationToken}`
    });

    return res.status(201).json({
      message: 'Registration successful. Verify your email in-app or check console logs.',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newProfile.fullName
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message,
      stack: error.stack
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email }).populate('profile');

    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, setCookieOptions);
    res.cookie('accessToken', accessToken, setCookieOptions);

    return res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        fullName: user.profile?.fullName || ''
      }
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const googleOAuth = async (req, res) => {
  const { email, name, googleId } = req.body;
  
  if (!email || !googleId) {
    return res.status(400).json({ message: 'Google email and account ID are required' });
  }

  try {
    // Check if user exists by email or googleId
    let user = await User.findOne({ $or: [{ email }, { googleId }] }).populate('profile');

    if (!user) {
      // Create OAuth user
      user = new User({
        email,
        googleId,
        isVerified: true // Google accounts are auto-verified
      });
      await user.save();

      const profile = new Profile({
        userId: user._id,
        fullName: name || 'Google Candidate',
        dateOfBirth: new Date(),
        gender: 'Not Specified',
        category: 'General',
        phone: '',
        address: '',
        highSchoolMarks: 0,
        higherSecondaryMarks: 0,
        board: ''
      });
      await profile.save();
      user.profile = profile; // Attach for returning user payload

      notificationService.sendWelcomeEmail(user.email, profile.fullName).catch(console.error);
    } else if (!user.googleId) {
      // Link Google Account to existing email account
      user.googleId = googleId;
      user.isVerified = true;
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, setCookieOptions);
    res.cookie('accessToken', accessToken, setCookieOptions);

    return res.json({
      message: 'Google Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        fullName: user.profile?.fullName || ''
      }
    });
  } catch (error) {
    console.error('[Google OAuth Error]', error);
    return res.status(500).json({ message: 'Server error during Google Login' });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'op_apply_jwt_refresh_secret_key_2026_abc');
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.cookie('accessToken', newAccessToken, setCookieOptions);

    return res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('[Token Refresh Error]', error);
    return res.status(401).json({ message: 'Session expired, please login again' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  return res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // To prevent account harvesting, return success even if user not found
      return res.json({ message: 'If email exists, reset instructions have been sent.' });
    }

    // Generate reset token with 15-minute expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send password reset email
    await notificationService.sendPasswordResetEmail(user.email, resetToken);

    return res.json({ message: 'If email exists, reset instructions have been sent.' });
  } catch (error) {
    console.error('[Forgot Password Error]', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.json({ message: 'Password updated successfully. Please login with your new password.' });
  } catch (error) {
    console.error('[Reset Password Error]', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired email verification token' });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.json({ message: 'Email verification successful. Your account is now active.' });
  } catch (error) {
    console.error('[Verify Email Error]', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
