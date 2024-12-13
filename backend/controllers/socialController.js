const User = require('../models/User');
const Notification = require('../models/Notification');
const io = require('../config/socket');
const { createNotification } = require('../utils/notificationHelper');

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

exports.sendFriendRequest = async (req, res) => {
    const { userId } = req.body;
    const currentUser = req.user;

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Check if there's an existing friend request from target to current user
        const existingRequest = await Notification.findOne({
            user: currentUser._id,
            actorId: userId,
            actionType: 'friend_request',
            status: 'pending'
        });

        if (existingRequest) {
            // Auto-accept since both users sent requests
            existingRequest.status = 'accepted';
            await existingRequest.save();

            // Add both users as friends
            if (!currentUser.friends.includes(userId)) {
                currentUser.friends.push(userId);
                targetUser.friends.push(currentUser._id);
                await Promise.all([currentUser.save(), targetUser.save()]);
            }

            // Notify target user about accepted request
            await createNotification({
                userId,
                actorId: currentUser._id,
                actionType: 'friend_request',
                message: `${currentUser.username} accepted your friend request`,
                status: 'accepted'
            });

            return res.status(200).json({ message: 'Friend request accepted automatically' });
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
    const { notificationId, accept } = req.body;
    const currentUser = req.user;

    try {
        const notification = await Notification.findById(notificationId)
            .populate('actorId', 'username');

        if (!notification) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        notification.status = accept ? 'accepted' : 'declined';
        await notification.save();

        if (accept) {
            const requestingUser = await User.findById(notification.actorId);
            
            // Add as friends
            currentUser.friends.push(notification.actorId);
            requestingUser.friends.push(currentUser._id);
            await Promise.all([currentUser.save(), requestingUser.save()]);

            // Notify the requesting user
            await createNotification({
                userId: notification.actorId._id,
                actorId: currentUser._id,
                actionType: 'friend_request',
                message: `${currentUser.username} accepted your friend request`,
                status: 'accepted'
            });
        }

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

// Optional: Add unblock functionality
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
