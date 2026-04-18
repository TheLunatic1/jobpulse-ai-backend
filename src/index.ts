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
import profileRoutes from './routes/profileRoutes';
import savedJobRoutes from './routes/savedJobRoutes';
import notificationRoutes from './routes/notificationRoutes';
import companyRoutes from './routes/companyRoutes';
import adminRoutes from './routes/adminRoutes';


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
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', savedJobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// REST endpoint for admin broadcast (optional – can trigger from frontend)
app.post('/api/admin/broadcast', protect, restrictTo('admin'), (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message required' });

  io.emit('broadcast', { message, timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'Broadcast sent to all users' });
});

// Temporary test route to check if Message model works
app.post('/api/messages/test-save', protect, async (req, res) => {
  try {
    const { senderId, receiverId, content, roomId } = req.body;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      roomId,
    });

    res.json({ success: true, message: 'Message saved successfully', data: message });
  } catch (err: any) {
    console.error('Test save error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, content, roomId, senderName } = data;

      if (!senderId || !receiverId || !content || !roomId) {
        console.log('❌ Invalid message data');
        return;
      }

      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content: content.trim(),
        roomId,
      });

      io.to(roomId).emit('receiveMessage', {
        ...message.toObject(),
        senderName: senderName || 'User',
      });

      console.log(`✅ Message saved to MongoDB in room ${roomId}`);
    } catch (err: any) {
      console.error('❌ Failed to save message:', err.message);
    }
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