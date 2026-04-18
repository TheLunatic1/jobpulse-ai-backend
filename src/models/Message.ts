import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String,
    required: true 
  },
  receiver: { 
    type: String,
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  roomId: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
}, { 
  timestamps: true 
});

export default mongoose.model('Message', messageSchema);