import express from 'express';
import { 
  applyToJob, 
  getApplicationsForJob, 
  updateApplicationStatus, 
  getMyApplications,
  getEmployerApplications 
} from '../controllers/applicationController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, restrictTo('jobseeker'), applyToJob);
router.get('/my', protect, restrictTo('jobseeker'), getMyApplications);

// New Employer route
router.get('/employer', protect, restrictTo('employer'), getEmployerApplications);

router.get('/job/:jobId', protect, getApplicationsForJob);
router.patch('/:id/status', protect, updateApplicationStatus);

export default router;