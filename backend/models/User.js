const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  status: { type: String, default: 'offline' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);