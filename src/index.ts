// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' },
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('JobPulse AI Backend is running!'));

app.get('/api/auth/test', (req, res) => res.json({ success: true, message: 'Auth routes working!' }));

// Socket.IO for messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', {
      senderId: data.senderId,
      message: data.message,
      timestamp: new Date(),
    });
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
    console.error(err);
  }
};

start();