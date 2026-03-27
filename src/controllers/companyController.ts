import { Request, Response } from 'express';
import User from '../models/User';
import Job from '../models/Job';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await User.find({ role: 'employer' })
      .select('companyName companyLogo companyDescription industry location bio _id')
      .sort({ createdAt: -1 });

    res.json({ success: true, companies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await User.findById(id).select('-password');
    if (!company || company.role !== 'employer') {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ postedBy: id, status: 'approved' });

    res.json({
      success: true,
      company: {
        _id: company._id,
        companyName: company.companyName,
        companyLogo: company.companyLogo,
        companyDescription: company.companyDescription,
        website: company.website,
        industry: company.industry,
        location: company.location || 'Not specified',
        bio: company.bio,
      },
      jobs
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCompanyProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ success: false, message: 'Only employers can update company profile' });
    }

    const updateData = { ...req.body };

    const company = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    res.json({ success: true, message: 'Company profile updated', company });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};