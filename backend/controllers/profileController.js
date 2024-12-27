const User = require("../models/User");
const Post = require('../models/Post');


exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.profileId)
            .select('-password -blockedUsers');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.profileId })
            .sort({ createdAt: -1 })
            .populate('author', 'username profileImage');

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.profileId)
            .populate('friends', 'username profileImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.profileId)
            .populate('followers', 'username profileImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Ensure user can only update their own profile
        if (req.user.id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const { username, email, profileImage } = req.body;
        const updates = {};

        // Check if the username or email already exists and belongs to another user
        if (username) {
            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername && existingUserByUsername.id !== req.user.id) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            updates.username = username;
        }

        if (email) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail && existingUserByEmail.id !== req.user.id) {
                return res.status(400).json({ message: 'Email already taken' });
            }
            updates.email = email;
        }

        // Add profileImage to updates only if provided
        if (profileImage) {
            updates.profileImage = profileImage;
        }

        // Update user with only the provided fields
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, select: '-password -blockedUsers' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
