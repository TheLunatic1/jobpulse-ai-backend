import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import Job from '../models/Job';

export const saveJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { jobId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.savedJobs?.includes(jobId as any)) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }

    user.savedJobs = user.savedJobs || [];
    user.savedJobs.push(jobId as any);
    await user.save();

    res.json({ success: true, message: 'Job saved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const unsaveJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { jobId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.savedJobs = user.savedJobs?.filter(id => id.toString() !== jobId) || [];
    await user.save();

    res.json({ success: true, message: 'Job removed from saved' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSavedJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(req.user.userId)
      .populate({
        path: 'savedJobs',
        match: { status: 'approved' },
        select: 'title company location salary type'
      });

    res.json({ success: true, savedJobs: user?.savedJobs || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};