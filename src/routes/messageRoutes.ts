import express from 'express';
import { getChatHistory } from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:roomId', protect, getChatHistory);

export default router;