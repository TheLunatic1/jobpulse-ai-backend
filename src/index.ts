import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('JobPulse AI Backend (TypeScript) is running!');
});

app.get('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    time: new Date().toISOString(),
  });
});

// Socket.IO basic connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Test: http://localhost:${PORT}/api/auth/test`);
    });
  } catch (err) {
    console.error('Server failed:', err);
    process.exit(1);
  }
};

startServer();
