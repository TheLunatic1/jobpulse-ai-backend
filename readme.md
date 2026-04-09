# JobPulse AI – Backend

Powerful Express.js + TypeScript backend for the JobPulse AI job portal with role-based access, AI integration, and real-time features.

## 🛠️ Tech Stack
- **Node.js + Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Socket.IO** (Real-time messaging)
- **Grok-3-Mini** (AI Career Coach via GitHub Models)
- **bcryptjs**, **cors**, **dotenv**

## ✨ Key Features

### Authentication & Authorization
- Secure JWT-based login/register
- Role-based middleware (`jobseeker`, `employer`, `admin`)
- Protected routes for different user types

### Job Management
- Employers can post jobs (pending admin approval)
- Admin can approve/reject jobs
- Public endpoint returns only approved jobs
- Search with filters (title, location, type, salary)

### Applications
- Job seekers can apply with cover letter
- Employers can view and manage applications
- Status updates: Pending → Shortlisted → Accepted/Rejected

### AI Career Coach
- Integrated with **Grok-3-Mini** via GitHub Models
- Smart, contextual career advice, interview prep, resume feedback

### Real-time Features
- Socket.IO for messaging between job seekers and recruiters
- Admin broadcast capability

### Additional
- Company profile management
- User profile with resume upload support
- Admin statistics and management

## 🚀 Setup

```bash
git clone https://github.com/TheLunatic1/jobpulse-ai-backend.git
cd jobpulse-ai-backend

npm install
```

Create `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GITHUB_TOKEN=your_github_models_token   # Optional (for AI)
```

Run development:
```bash
npm run dev
```

Build & Start:
```bash
npm run build
npm start
```

## 📡 Main API Routes

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Jobs**
- `GET /api/jobs` → Public approved jobs
- `GET /api/jobs/admin` → Admin only (all jobs)
- `POST /api/jobs` → Employer post job
- `PATCH /api/jobs/:id/approve` → Admin
- `PATCH /api/jobs/:id/reject` → Admin

**Applications**
- `POST /api/applications`
- `GET /api/applications/my` → Job seeker
- `GET /api/applications/employer` → Employer
- `PATCH /api/applications/:id/status`

**AI Coach**
- `POST /api/ai/coach`

## 📋 Features Implemented
- Full role-based access control
- Job approval workflow
- AI integration
- Real-time Socket.IO
- Secure password hashing
- Input validation & error handling

---

Made by **Salman Toha**  