const User = require('../models/User');
const Notification = require('../models/Notification');
const { createNotification } = require('../utils/notificationHelper');
const { getIoInstance } = require('../config/socket');


exports.followUser = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        if (!targetUser.followers.includes(currentUser._id)) {
            targetUser.followers.push(currentUser._id);
            await targetUser.save();

            currentUser.following.push(userId);
            await currentUser.save();

            // Create follow notification
            await createNotification({
                userId,
                actorId: currentUser._id,
                actionType: 'follow',
                message: `${currentUser.username} started following you`
            });
        }

        res.status(200).json({ message: 'Successfully followed user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
        await targetUser.save();

        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        await currentUser.save();

        // Create unfollow notification
        await createNotification({
            userId,
            actorId: currentUser._id,
            actionType: 'unfollow',
            message: `${currentUser.username} unfollowed you`
        });

        res.status(200).json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFriendRequests = async (req, res) => {
    const currentUser = req.user;

    try {
        const friendRequests = await Notification.find({
            user: currentUser._id,
            actionType: 'friend_request',
            status: 'pending'
        })
            .populate('actorId', 'username profileImage');

        res.status(200).json(friendRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ error: 'Failed to fetch friend requests' });
    }
};

exports.sendFriendRequest = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Check if users are already friends
        if (currentUser.friends.includes(userId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // Check if there's already a pending 3
        const existingRequest = await Notification.findOne({
            $or: [
                { user: userId, actorId: currentUser._id },
                { user: currentUser._id, actorId: userId }
            ],
            actionType: 'friend_request',
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'A friend request already exists between these users' });
        }

        // Create new friend request notification
        await createNotification({
            userId,
            actorId: currentUser._id,
            actionType: 'friend_request',
            message: `${currentUser.username} sent you a friend request`,
            status: 'pending'
        });

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.respondToFriendRequest = async (req, res) => {
    const { notificationId, userId, accept } = req.body;
    const currentUser = req.user;
    const io = getIoInstance();

    try {
        let notification;
        
        if (notificationId) {
            // If notification ID is provided, use it
            notification = await Notification.findById(notificationId)
                .populate('actorId', 'username');
                
            if (!notification) {
                return res.status(404).json({ message: 'Friend request not found' });
            }
        } else if (userId) {
            // If user ID is provided, find the pending friend request
            notification = await Notification.findOne({
                user: currentUser._id,
                actorId: userId,
                actionType: 'friend_request',
                status: 'pending'
            }).populate('actorId', 'username');

            if (!notification) {
                return res.status(404).json({ message: 'No pending friend request found from this user' });
            }
        } else {
            return res.status(400).json({ message: 'Either notificationId or userId is required' });
        }

        notification.status = accept ? 'accepted' : 'declined';
        await notification.save();

        if (accept) {
            const requestingUser = await User.findById(notification.actorId);
            
            // Add as friends
            if (!currentUser.friends.includes(notification.actorId._id)) {
                currentUser.friends.push(notification.actorId._id);
            }
            if (!requestingUser.friends.includes(currentUser._id)) {
                requestingUser.friends.push(currentUser._id);
            }
            await Promise.all([currentUser.save(), requestingUser.save()]);
        }
        // Emit notification
        io.to(userId).emit('friend-request-respond', {
            notificationId: notification._id,
            accept
        });
        res.status(200).json({ message: accept ? 'Friend request accepted' : 'Friend request declined' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.blockUser = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        if (!currentUser.blockedUsers.includes(userId)) {
            currentUser.blockedUsers.push(userId);
            await currentUser.save();

            // Create block notification
            await createNotification({
                userId,
                actorId: currentUser._id,
                actionType: 'block',
                message: `${currentUser.username} has blocked you`
            });
        }

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unfriend = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;
    const io = getIoInstance();

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Remove from friends list
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== userId);
        targetUser.friends = targetUser.friends.filter(id => id.toString() !== currentUser._id.toString());

        // Optionally, remove mutual follow as well
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        currentUser.followers = currentUser.followers.filter(id => id.toString() !== userId);
        targetUser.following = targetUser.following.filter(id => id.toString() !== currentUser._id.toString());
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

        await Promise.all([currentUser.save(), targetUser.save()]);

        // Create notification
        const notification = await Notification.create({
            user: userId,
            actorId: currentUser._id,
            actionType: 'unfriend',
            message: `${currentUser.username} removed you from their friends list`
        });

        // Emit notification
        io.to(userId).emit('notification', {
            notification,
            actor: currentUser
        });

        res.status(200).json({ message: `You have unfriended ${targetUser.username}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unblockUser = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;
    const io = getIoInstance();

    try {
        if (!currentUser.blockedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User is not blocked' });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove user from blockedUsers array
        currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id.toString() !== userId);
        await currentUser.save();

        // Create notification
        const notification = await Notification.create({
            user: userId,
            actorId: currentUser._id,
            actionType: 'unblock',
            message: `${currentUser.username} has unblocked you`
        });

        // Emit notification
        io.to(userId).emit('notification', {
            notification,
            actor: currentUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
