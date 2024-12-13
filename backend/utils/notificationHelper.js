const Notification = require('../models/Notification');
const { getIoInstance } = require('../config/socket');

const createNotification = async ({
    userId, // recipient
    actorId, // user performing the action
    postId = null,
    actionType,
    message
}) => {
    try {
        const notification = await Notification.create({
            user: userId,
            actorId,
            postId,
            actionType,
            message,
            isRead: false
        });

        const populatedNotification = await notification.populate('actorId', 'username profilePicture');
        
        // Get socket instance
        const io = getIoInstance();
        
        // Emit to specific user
        io.to(userId.toString()).emit('notification', {
            notification: populatedNotification,
            actor: populatedNotification.actorId
        });

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

module.exports = { createNotification }; 