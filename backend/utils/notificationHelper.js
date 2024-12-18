const Notification = require('../models/Notification');
const { getIoInstance } = require('../config/socket');

const createNotification = async ({
    userId,
    actorId,
    postId = null,
    actionType,
    message
}) => {
    console.log('Creating notification:', {
        userId,
        actorId,
        postId,
        actionType,
        message
    });

    try {
        const notification = await Notification.create({
            user: userId,
            actorId,
            postId,
            actionType,
            message,
            isRead: false
        });

        console.log('Notification created:', notification._id);

        const populatedNotification = await notification.populate('actorId', 'username profilePicture');
        console.log('Populated notification:', {
            id: populatedNotification._id,
            actor: populatedNotification.actorId.username
        });
        
        // Get socket instance
        const io = getIoInstance();
        
        console.log('Emitting notification to user:', userId.toString());
        
        // Emit to specific user
        io.to(userId.toString()).emit('notification', {
            notification: populatedNotification,
            actor: populatedNotification.actorId
        });

        return notification;
    } catch (error) {
        console.error('Error in createNotification:', error);
        throw error;
    }
};

module.exports = { createNotification }; 