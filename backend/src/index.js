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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup supporting credential cookies from the Vite development server
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' })); // Support base64 image streams
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static profile uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(500).json({ message: 'Internal server error occurred' });
});

// Start simulated cron task
startDeadlineReminderCron();

// Start Express Listener
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` OP.Apply Unified API server listening on port ${PORT}`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(` Static Uploads: http://localhost:${PORT}/uploads/`);
  console.log(`===================================================`);
});
