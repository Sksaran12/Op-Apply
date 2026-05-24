import express from 'express';
import {
  submitApplication,
  getUserApplications,
  downloadAdmitCard
} from '../controllers/applicationController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// All application endpoints are protected
router.use(protect);

router.post('/', submitApplication);
router.get('/', getUserApplications);
router.get('/:id/admit-card', downloadAdmitCard);

export default router;
