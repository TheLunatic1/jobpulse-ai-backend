import express from 'express';
import { getAdminStats, getAllUsers, getAllApplications } from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, restrictTo('admin'), getAdminStats);
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.get('/applications', protect, restrictTo('admin'), getAllApplications);

export default router;