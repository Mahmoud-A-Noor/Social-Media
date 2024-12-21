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

        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    username,
                    email,
                    profileImage
                }
            },
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