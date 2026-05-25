import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import examRoutes from './routes/examRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { startDeadlineReminderCron } from './services/notificationService.js';
import connectDB from './config/db.js';
import { seedExams } from './config/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup supporting credential cookies from development and production environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://op-apply-git-main-saran-mandals-projects.vercel.app',
  'https://op-apply.onrender.com'
];

if (process.env.FRONTEND_URL) {
  const envOrigin = process.env.FRONTEND_URL.replace(/\/$/, '');
  if (!allowedOrigins.includes(envOrigin)) {
    allowedOrigins.push(envOrigin);
  }
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Support base64 image streams
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static profile uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve static frontend files (unified deploy fallback)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Mount API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    service: 'OP.Apply Unified API Server'
  });
});

// Wildcard catch-all to route to React's index.html for frontend routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(500).json({ message: 'Internal server error occurred' });
});

// Start simulated cron task for deadline checks
startDeadlineReminderCron();

// Startup database verification and connection
async function startServer() {
  try {
    // 1. Connect to MongoDB via Mongoose
    await connectDB();
    
    // 2. Run exam collection seeds
    await seedExams();
  } catch (error) {
    console.error('[Startup Error] Failed to initialize server dependencies:', error.message);
  }

  // Start Express Listener
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(` OP.Apply Unified API server listening on port ${PORT}`);
    console.log(` API Endpoint: http://localhost:${PORT}`);
    console.log(` Static Uploads: http://localhost:${PORT}/uploads/`);
    console.log(`===================================================`);
  });
}

startServer();
