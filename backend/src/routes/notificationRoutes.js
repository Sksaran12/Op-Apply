import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// All notification endpoints are protected
router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
