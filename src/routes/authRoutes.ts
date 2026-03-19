import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { restrictTo } from '../middleware/roleMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/test', (req, res) => res.json({ success: true, message: 'Auth routes working!' }));

// Protected routes
router.get('/me', protect, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Logout (simple - frontend deletes token)
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully. Delete token on client side.',
  });
});

// Role-based example: only admin can access stats
router.get('/admin/stats', protect, restrictTo('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin stats endpoint',
    stats: {
      totalUsers: 42,
      activeJobs: 128,
      pendingApplications: 19,
    },
  });
});

// Example: only employer can post a job (placeholder)
router.post('/jobs', protect, restrictTo('employer'), (req, res) => {
  res.json({
    success: true,
    message: 'Job posted successfully (placeholder)',
  });
});

export default router;
