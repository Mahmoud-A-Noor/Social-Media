const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Triggering user
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Related post (optional)
    actionType: { type: String, required: true }, // 'comment', 'like', 'follow', etc.
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);