const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  hiddenPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  profileImage: String,
  story: {
    url: String,
    addedAt: { type: Date, default: null }
  },
  status: { 
    type: String, 
    default: 'offline', 
    enum: ['online', 'offline'] 
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  unreadMessages: {
    type: Map,
    of: Number,  // Maps chatId to number of unread messages
    default: {}
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add index for better query performance
userSchema.index({ status: 1 });
userSchema.index({ 'unreadMessages': 1 });

// Method to increment unread messages for a specific chat
userSchema.methods.incrementUnread = async function(chatId) {
  if (!this.unreadMessages) {
    this.unreadMessages = new Map();
  }
  const currentCount = this.unreadMessages.get(chatId) || 0;
  this.unreadMessages.set(chatId, currentCount + 1);
  return this.save();
};

// Method to clear unread messages for a specific chat
userSchema.methods.clearUnread = async function(chatId) {
  if (this.unreadMessages && this.unreadMessages.has(chatId)) {
    this.unreadMessages.delete(chatId);
    return this.save();
  }
};

// Virtual for total unread messages
userSchema.virtual('totalUnreadMessages').get(function() {
  if (!this.unreadMessages) return 0;
  return Array.from(this.unreadMessages.values()).reduce((a, b) => a + b, 0);
});

module.exports = mongoose.model('User', userSchema);