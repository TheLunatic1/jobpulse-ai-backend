import express from 'express';
import { getAdminStats, getAllUsers, getAllApplications, deleteUser } from '../controllers/adminController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/stats', protect, restrictTo('admin'), getAdminStats);
router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.get('/applications', protect, restrictTo('admin'), getAllApplications);
router.delete('/users/:id', protect, restrictTo('admin'), deleteUser);

export default router;