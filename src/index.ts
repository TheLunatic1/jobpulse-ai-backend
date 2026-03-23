import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import messageRoutes from './routes/messageRoutes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { protect, restrictTo } from './middleware/authMiddleware';
import Message from './models/Message';
import aiRoutes from './routes/aiRoutes';



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://jobpulse-ai-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', protect, applicationRoutes);
app.use('/api/messages', protect, messageRoutes);
app.use('/api/ai', protect, aiRoutes);

// REST endpoint for admin broadcast (optional – can trigger from frontend)
app.post('/api/admin/broadcast', protect, restrictTo('admin'), (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message required' });

  io.emit('broadcast', { message, timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Broadcast sent to all users' });
});

// Socket.IO logic (unchanged + added history request)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined ${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    // Save to DB
    const message = await Message.create({
      roomId: data.roomId,
      sender: data.senderId,
      content: data.message,
    });

    io.to(data.roomId).emit('receiveMessage', {
      ...data,
      _id: message._id,
      timestamp: message.timestamp,
    });
  });

  socket.on('getMessages', async ({ roomId }) => {
    const messages = await Message.find({ roomId })
      .populate('sender', 'name')
      .sort({ timestamp: 1 })
      .limit(50);
    socket.emit('loadMessages', messages);
  });

  socket.on('adminBroadcast', (message) => {
    io.emit('broadcast', { message, timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Server start error:', err);
    process.exit(1);
  }
};

start();