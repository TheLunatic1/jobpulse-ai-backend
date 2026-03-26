import express from 'express';
import { saveJob, unsaveJob, getSavedJobs } from '../controllers/savedJobController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:jobId/save', protect, restrictTo('jobseeker'), saveJob);
router.delete('/:jobId/save', protect, restrictTo('jobseeker'), unsaveJob);
router.get('/saved', protect, restrictTo('jobseeker'), getSavedJobs);

export default router;