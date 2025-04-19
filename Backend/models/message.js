import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    trim: true
  },
  // For one-on-one messaging
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // For team messaging
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  // Message type: 'direct' for one-on-one, 'team' for team messages
  messageType: {
    type: String,
    enum: ['direct', 'team'],
    default:'direct'
  },
  // Message status: 'sent', 'delivered', 'read'
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  // Array of users who have read the message (for team messages)
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Optional: For file attachments
  attachments: [{
    type: {
      type: String, // 'image', 'file', 'code', etc.
     
    },
    url: {
      type: String,
         },
    name: String,
    size: Number
  }],
  // Optional: For code snippets
  codeSnippet: {
    language: String,
    code: String,
    description: String
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
messageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ team: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
