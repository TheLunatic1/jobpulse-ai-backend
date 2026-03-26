import express from 'express';
import { getProfile, updateProfile, upload } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, upload.single('resume'), updateProfile);

export default router;