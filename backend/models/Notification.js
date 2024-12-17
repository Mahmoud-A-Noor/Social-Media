const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Triggering user
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }, // Related post (optional)
    message: { type: String, required: true },
    actionType: { 
        type: String, 
        enum: ['comment', 'reaction', 'share', 'friend_request', 'follow', 'unfollow', 'unfriend', 'block', 'live_stream'],
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined', 'read'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);