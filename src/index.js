const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('JobPulse AI Backend is live!');
});

app.get('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working!',
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log(`Test: http://localhost:${PORT}/api/auth/test`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();