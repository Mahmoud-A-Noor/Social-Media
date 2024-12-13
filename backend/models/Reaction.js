const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['like', 'love', 'care', 'haha', 'wow', 'sad', 'angry'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only have one reaction per post
reactionSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);