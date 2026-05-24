import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  
  // Read token from authorization headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'op_apply_jwt_secret_key_2026_xyz');
    
    // Inject user details into request
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error] Invalid token:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};

export default protect;
