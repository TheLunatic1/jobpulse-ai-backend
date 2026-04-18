import express from 'express';
import { 
  createJob, 
  getApprovedJobs, 
  getAdminJobs, 
  searchJobs, 
  getMyJobs, 
  approveJob, 
  rejectJob, 
  deleteJob 
} from '../controllers/jobController';

import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.get('/', getApprovedJobs);                    // Homepage & Find Jobs → only approved
router.get('/search', searchJobs);                   // Public search

// ==================== ADMIN ROUTE ====================
router.get('/admin', protect, restrictTo('admin'), getAdminJobs);   // ← This is what AdminPanel will use

// ==================== PROTECTED EMPLOYER ROUTES ====================
router.post('/', protect, restrictTo('employer', 'admin'), createJob);
router.get('/my', protect, restrictTo('employer'), getMyJobs);

// ==================== ADMIN ONLY ROUTES ====================
router.patch('/:id/approve', protect, restrictTo('admin'), approveJob);
router.patch('/:id/reject', protect, restrictTo('admin'), rejectJob);
router.delete('/:id', protect, deleteJob);

export default router;