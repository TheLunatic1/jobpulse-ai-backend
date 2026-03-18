require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection FAILED:', err.message);
    process.exit(1);
  });