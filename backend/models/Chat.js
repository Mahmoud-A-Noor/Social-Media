const mongoose = require('mongoose');
const { Schema } = mongoose;


const chatSchema = new Schema(
  {
    participants: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map()
    }
  },
  { timestamps: true }
);

// Ensure chat is between exactly 2 participants (no group chats)
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    next(new Error('Chat must have exactly 2 participants'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);