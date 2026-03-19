// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/test', (req, res) => res.json({ success: true, message: 'Auth routes working!' }));

// Protected: current user
router.get('/me', protect, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Admin-only example route
router.get('/admin/stats', protect, adminOnly, (req, res) => {
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

export default router;