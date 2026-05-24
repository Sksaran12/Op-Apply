import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
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
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user and empty profile profile details
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        profile: {
          create: {
            fullName,
            dateOfBirth: new Date(),
            gender: 'Not Specified',
            category: 'General',
            phone: '',
            address: '',
            highSchoolMarks: 0,
            higherSecondaryMarks: 0,
            board: ''
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Send emails (welcome & verification) in background
    notificationService.sendWelcomeEmail(newUser.email, fullName).catch(console.error);
    notificationService.sendVerificationEmail(newUser.email, verificationToken).catch(console.error);

    // Create database notification with verification link so it's accessible directly in-app
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        title: 'Welcome! Verify Your Email',
        message: `Welcome to OP.Apply! Since this is a local development environment, use this link to verify your email directly: verify_token_${verificationToken}`
      }
    });

    // Return success without signing in directly (requires verification or sign in)
    return res.status(201).json({
      message: 'Registration successful. Verify your email in-app or check console logs.',
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.profile.fullName
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, setCookieOptions);
    res.cookie('accessToken', accessToken, setCookieOptions);

    return res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
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
  const { token, email, name, googleId } = req.body;
  // If credentials are empty or mock is triggered, we simulate
  if (!email || !googleId) {
    return res.status(400).json({ message: 'Google email and account ID are required' });
  }

  try {
    // Check if user exists by email or googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId }
        ]
      },
      include: { profile: true }
    });

    if (!user) {
      // Create OAuth user
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          isVerified: true, // Google accounts are auto-verified
          profile: {
            create: {
              fullName: name || 'Google Candidate',
              dateOfBirth: new Date(),
              gender: 'Not Specified',
              category: 'General',
              phone: '',
              address: '',
              highSchoolMarks: 0,
              higherSecondaryMarks: 0,
              board: ''
            }
          }
        },
        include: { profile: true }
      });
      
      notificationService.sendWelcomeEmail(user.email, user.profile.fullName).catch(console.error);
    } else if (!user.googleId) {
      // Link Google Account to existing email account
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, isVerified: true },
        include: { profile: true }
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, setCookieOptions);
    res.cookie('accessToken', accessToken, setCookieOptions);

    return res.json({
      message: 'Google Login successful',
      accessToken,
      user: {
        id: user.id,
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
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const newAccessToken = generateAccessToken(user.id);
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
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      // To prevent account harvesting, return success even if user not found
      return res.json({ message: 'If email exists, reset instructions have been sent.' });
    }

    // Generate reset token with 15-minute expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires }
    });

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
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user profile fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

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
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired email verification token' });
    }

    // Mark as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    return res.json({ message: 'Email verification successful. Your account is now active.' });
  } catch (error) {
    console.error('[Verify Email Error]', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
