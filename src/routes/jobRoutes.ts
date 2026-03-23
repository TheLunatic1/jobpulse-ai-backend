import express from 'express';
import { createJob, getApprovedJobs, getMyJobs, approveJob, rejectJob, deleteJob } from '../controllers/jobController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Public route – no auth needed (approved jobs for everyone)
router.get('/', getApprovedJobs);

// Protected routes – require login + role check
router.post('/', protect, restrictTo('employer'), createJob);
router.get('/my', protect, restrictTo('employer'), getMyJobs);
router.patch('/:id/approve', protect, restrictTo('admin'), approveJob);
router.patch('/:id/reject', protect, restrictTo('admin'), rejectJob);
router.delete('/:id', protect, deleteJob);

export default router;