import express from 'express';
import { applyToJob, getApplicationsForJob, updateApplicationStatus, getMyApplications } from '../controllers/applicationController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, restrictTo('jobseeker'), applyToJob);
router.get('/my', protect, restrictTo('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, getApplicationsForJob);
router.patch('/:id/status', protect, updateApplicationStatus);

export default router;