import express from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/companyController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// Public route - anyone can view company profile
router.get('/:id', getCompanyProfile);

// Protected - only the employer can update their own company profile
router.put('/', protect, restrictTo('employer'), updateCompanyProfile);

export default router;