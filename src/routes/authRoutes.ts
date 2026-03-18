import { Router } from 'express';

const router = Router();

// Test route - just to confirm server is running
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is alive! Auth routes are working.',
    timestamp: new Date().toISOString(),
  });
});

export default router;