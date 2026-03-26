import { Request, Response } from 'express';
import Job from '../models/Job';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const job = await Job.create({
      ...req.body,
      postedBy: req.user.userId,
    });

    res.status(201).json({ success: true, message: 'Job posted successfully! Waiting for admin approval.', job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApprovedJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ status: 'approved' }).populate('postedBy', 'name');
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// NEW: Search with filters
export const searchJobs = async (req: Request, res: Response) => {
  try {
    const { title, location, type, minSalary } = req.query;

    const query: any = { status: 'approved' };

    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (minSalary) query.salary = { $gte: minSalary };

    const jobs = await Job.find(query).populate('postedBy', 'name');
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const jobs = await Job.find({ postedBy: req.user.userId });
    res.json({ success: true, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });

    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user.userId }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin only' });

    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};