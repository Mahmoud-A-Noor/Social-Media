const Notification = require('../models/Notification');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationHelper');


exports.getNotifications = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    try {
        const notifications = await Notification.find({ user: userId })
            .populate('actorId', 'username profileImage')
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
            status: "pending"
        });
        res.status(200).json({ count });
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
            { user: req.user._id, status: { $ne: 'read' }, actionType: { $ne: "friend_request" } },
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

    console.log('Creating live stream notification:', {
        userId,
        streamData
    });

    try {
        const user = await User.findById(userId)
            .populate('followers')
            .populate('friends');

        console.log('Found user with followers:', {
            username: user.username,
            followersCount: user.followers.length,
            friendsCount: user.friends.length
        });

        let targetUsers = [];

        if (streamData.visibility === 'public') {
            targetUsers = user.followers.map(follower => follower._id);
            console.log('Public stream - targeting followers:', targetUsers.length);
        } else if (streamData.visibility === 'friends') {
            targetUsers = user.friends.map(friend => friend._id);
            console.log('Friends-only stream - targeting friends:', targetUsers.length);
        }

        console.log('Creating notifications for users:', targetUsers.length);

        const notifications = await Promise.all(
            targetUsers.map(targetUserId => {
                console.log('Creating notification for user:', targetUserId);
                return createNotification({
                    userId: targetUserId,
                    actorId: userId,
                    actionType: 'live_stream',
                    message: `${user.username} started a live stream${streamData.text ? `: ${streamData.text}` : ''}`
                });
            })
        );

        console.log('Successfully created notifications:', notifications.length);

        res.status(200).json({ 
            message: 'Live stream notifications created', 
            notifications 
        });
    } catch (error) {
        console.error('Error creating live stream notifications:', error);
        res.status(500).json({ error: error.message });
    }
};