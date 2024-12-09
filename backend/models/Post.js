const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: { type: String },
  media: {
    url: String,
    type: { type: String, enum: ['image', 'video', 'audio', 'unknown'], default: 'unknown' }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feeling:String,
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  shares: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['public', 'friends'], required: true }, // Share type
    sharedAt: { type: Date, default: Date.now }
  }
],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Posts', postSchema);