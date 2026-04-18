import express from 'express';
import { protect } from '../middleware/authMiddleware';
import Message from '../models/Message';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get conversation between current user and another user
router.get('/:userId', protect, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
    const currentUserId = req.user.userId;

    // NO demo guard - always try to load real messages
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    console.log(`Loaded ${messages.length} messages for user ${userId}`);

    res.json({ 
      success: true, 
      messages: messages || [] 
    });

  } catch (err: any) {
    console.error('❌ Message route error for userId:', req.params.userId, '->', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to load messages' 
    });
  }
});

export default router;