import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Job from '../models/Job';
import Application from '../models/Application';
import { Request, Response } from 'express';
import User from '../models/User';

export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        pendingJobs,
        totalApplications
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
