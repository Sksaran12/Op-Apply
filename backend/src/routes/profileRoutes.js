import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// All profile endpoints are protected
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
