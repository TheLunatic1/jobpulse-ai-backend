import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(req.user.userId).select('notifications');
    res.json({ success: true, notifications: user?.notifications || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.notifications = user.notifications?.map(notif => ({
      ...notif,
      read: true
    })) || [];

    await user.save();
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};