const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['like', 'wow', 'care', 'angry', 'haha', 'love', 'sad'],
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reaction', reactionSchema);