import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'employer' | 'admin';
  
  // Common profile fields
  phone?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  location?: string;   // ← Added this

  // Job Seeker specific
  skills?: string[];
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  resumeUrl?: string;
  savedJobs?: mongoose.Types.ObjectId[];

  // Recruiter / Employer specific
  companyName?: string;
  companyLogo?: string;
  companyDescription?: string;
  website?: string;
  industry?: string;

  notifications?: Array<{
    message: string;
    type: 'application' | 'job' | 'system';
    read: boolean;
    createdAt: Date;
  }>;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker' },

  // Common
  phone: String,
  linkedin: String,
  bio: String,
  avatar: String,
  location: String,     // ← Added this

  // Job Seeker
  skills: [String],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  resumeUrl: String,
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // Recruiter
  companyName: String,
  companyLogo: String,
  companyDescription: String,
  website: String,
  industry: String,

  notifications: [{
    message: String,
    type: { type: String, enum: ['application', 'job', 'system'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);