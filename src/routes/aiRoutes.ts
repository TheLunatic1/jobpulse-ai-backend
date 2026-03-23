import express from 'express';
import { aiCoachChat } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/coach', protect, aiCoachChat);

export default router;