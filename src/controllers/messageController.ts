import { Request, Response } from 'express';
import Message from '../models/Message';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getChatHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { roomId } = req.params;

    // Basic access control – only participants or admin
    // For simplicity, allow anyone in room (improve later with participants array)
    const messages = await Message.find({ roomId })
      .populate('sender', 'name')
      .sort({ timestamp: 1 })
      .limit(100);

    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};