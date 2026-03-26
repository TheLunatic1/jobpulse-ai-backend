import express from 'express';
import { createJob, getApprovedJobs, searchJobs, getMyJobs, approveJob, rejectJob, deleteJob } from '../controllers/jobController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getApprovedJobs);
router.get('/search', searchJobs);

// Protected employer routes
router.post('/', protect, restrictTo('employer'), createJob);
router.get('/my', protect, restrictTo('employer'), getMyJobs);

// Admin routes
router.patch('/:id/approve', protect, restrictTo('admin'), approveJob);
router.patch('/:id/reject', protect, restrictTo('admin'), rejectJob);
router.delete('/:id', protect, deleteJob);

export default router;