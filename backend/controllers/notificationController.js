const Notification = require('../models/Notification');



exports.getNotifications = async (req, res) => {
    const userId = req.user._id
    try {
        const notifications = await Notification.find({ user: userId })
            .populate('actorId', 'username profilePicture') // Include actor details
            .populate('postId', 'title') // Include post details
            .sort({ createdAt: -1 })
            .limit(20); // Limit for pagination

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.markNotificationsAsRead = async (req, res) => {
    const userId = req.user._id
    try {
        await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.clearNotifications = async (req, res) => {
    const userId = req.user._id
    try {
        await Notification.deleteMany({ user: userId });
        res.status(200).json({ message: 'Notifications are cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};