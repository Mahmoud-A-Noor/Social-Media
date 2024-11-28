const User = require('../models/User');



exports.followUser = async (req, res) => {
    const { userId } = req.body; // The user to be followed
    const currentUser = req.user; // Authenticated user

    try {
    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    // Check if current user is blocked by the target user
    if (targetUser.blockedUsers.includes(currentUser._id)) {
        return res.status(403).json({ message: 'You have been blocked by this user' });
    }

    // Check if target user is blocked by the current user
    if (currentUser.blockedUsers.includes(targetUser._id)) {
        return res.status(403).json({ message: 'You have blocked this user' });
    }

    // Add current user to target's followers if not already following
    if (!targetUser.followers.includes(currentUser._id)) {
        targetUser.followers.push(currentUser._id);
        await targetUser.save();
    }

    // Add target user to current user's following list
    if (!currentUser.following.includes(userId)) {
        currentUser.following.push(userId);
        await currentUser.save();
    }

    res.status(200).json({ message: `You are now following ${targetUser.username}` });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};


exports.unfollowUser = async (req, res) => {
    const { userId } = req.body; // The user to unfollow
    const currentUser = req.user; // Authenticated user

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Remove the target user from current user’s following list
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);

        // Remove current user from target user’s followers list
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: `You have unfollowed ${targetUser.username}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addFriend = async (req, res) => {
    const { userId } = req.body; // The user to be added as a friend
    const currentUser = req.user; // Authenticated user

    try {
        const targetUser = await User.findById(userId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // Check if the current user is blocked by the target user
        if (targetUser.blockedUsers.includes(currentUser._id)) {
        return res.status(403).json({ message: 'You have been blocked by this user' });
        }

        // Add both users as friends if they aren’t already
        if (!currentUser.friends.includes(userId)) {
        currentUser.friends.push(userId);
        targetUser.friends.push(currentUser._id);
        }

        // Ensure both users follow each other
        if (!currentUser.following.includes(userId)) {
        currentUser.following.push(userId);
        }
        if (!targetUser.followers.includes(currentUser._id)) {
        targetUser.followers.push(currentUser._id);
        }
        if (!targetUser.following.includes(currentUser._id)) {
        targetUser.following.push(currentUser._id);
        }
        if (!currentUser.followers.includes(userId)) {
        currentUser.followers.push(userId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: `You and ${targetUser.username} are now friends and following each other` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.unfriend = async (req, res) => {
    const { userId } = req.body; // The user to unfriend
    const currentUser = req.user; // Authenticated user

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

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: `You have unfriended ${targetUser.username}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.blockUser = async (req, res) => {
    const { userId } = req.body; // The user to be blocked
    const currentUser = req.user; // Authenticated user

    try {
        if (currentUser.blockedUsers.includes(userId)) {
        return res.status(400).json({ message: 'User is already blocked' });
        }

        // Add the target user to the blockedUsers array
        currentUser.blockedUsers.push(userId);

        // Remove any existing follow or friend relationship
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        currentUser.friends = currentUser.friends.filter(id => id.toString() !== userId);
        await currentUser.save();

        // Update the target user's followers and friends
        const targetUser = await User.findById(userId);
        if (targetUser) {
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
        targetUser.friends = targetUser.friends.filter(id => id.toString() !== currentUser._id.toString());
        await targetUser.save();
        }

        res.status(200).json({ message: `User has been blocked` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};