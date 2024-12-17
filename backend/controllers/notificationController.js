const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getNotifications = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        const notifications = await Notification.find({ user: userId })
            .populate('actorId', 'username profilePicture')
            .populate('postId', 'text')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Notification.countDocuments({ user: userId });
        
        res.status(200).json({
            notifications,
            hasMore: total > page * limit,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUnreadCount = async (req, res) => {
    const userId = req.user._id;
    try {
        const count = await Notification.countDocuments({ 
            user: userId, 
            isRead: false 
        });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markNotificationsAsRead = async (req, res) => {
    const userId = req.user._id;
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
    const userId = req.user._id;
    try {
        await Notification.deleteMany({ user: userId });
        res.status(200).json({ message: 'Notifications cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndUpdate(notificationId, { status: 'read' });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, status: { $ne: 'read' } },
            { status: 'read' }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLiveStreamNotification = async (req, res) => {
    const { streamData } = req.body;
    const userId = req.user._id;

    try {
        let targetUsers = [];

        // Determine target users based on visibility
        if (streamData.visibility === 'public') {
            // Notify all followers
            const user = await User.findById(userId);
            targetUsers = user.followers;
        } else if (streamData.visibility === 'friends') {
            // Notify only friends
            const user = await User.findById(userId);
            targetUsers = user.friends;
        }

        // Create notifications for all target users
        const notifications = await Promise.all(
            targetUsers.map(targetUserId =>
                createNotification({
                    userId: targetUserId,
                    actorId: userId,
                    actionType: 'live_stream',
                    message: `${req.user.username} started a live stream: ${streamData.text}`,
                    streamData
                })
            )
        );

        res.status(200).json({ message: 'Live stream notifications created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};