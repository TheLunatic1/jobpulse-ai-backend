import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const applyToJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { jobId, coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status !== 'approved') return res.status(400).json({ success: false, message: 'Job is not approved' });

    const existing = await Application.findOne({ job: jobId, applicant: req.user.userId });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied to this job' });

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
    });

    res.status(201).json({ success: true, application });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplicationsForJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email');

    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { status } = req.body;
    if (!['shortlisted', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    const job = await Job.findById(application.job);
    if (!job || (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Send notification to the applicant
    const applicant = await User.findById(application.applicant);
    if (applicant) {
      applicant.notifications = applicant.notifications || [];
      applicant.notifications.unshift({
        message: `Your application for "${job.title}" has been ${status}`,
        type: 'application',
        read: false,
        createdAt: new Date()
      });
      await applicant.save();
    }

    res.json({ success: true, application });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ success: false, message: 'Only jobseekers can view their applications' });
    }

    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job', 'title company location salary type status');

    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== NEW: EMPLOYER APPLICATIONS ====================
export const getEmployerApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Only employers can access this' });
    }

    const applications = await Application.find({})
      .populate({
        path: 'job',
        match: { postedBy: req.user.userId },
        select: 'title company location salary type'
      })
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });

    // Filter out any null jobs (safety)
    const filtered = applications.filter(app => app.job !== null);

    res.json({ success: true, applications: filtered });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};