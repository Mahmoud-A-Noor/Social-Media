const Post = require('../models/Post');
const User = require('../models/User');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const { getIoInstance } = require('../config/socket');
const cloudinary = require("../config/cloudinary");



exports.createPost = async (req, res) => {
    const { text, media, feeling, visibility="public" } = req.body;
    const userId = req.user._id;
    try {
        const post = await Post.create({
        text,
        media,
        feeling,
        visibility,
        author: userId
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Current user's ID
        const { page = 1, limit = 10 } = req.query;

        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skip = (page - 1) * limit;

        // Query to filter posts based on visibility rules and blocked users
        const query = {
            author: { $nin: currentUser.blockedUsers }, // Exclude blocked users
            $or: [
                { visibility: 'public' }, // Public posts
                { visibility: 'friends', author: { $in: currentUser.friends } }, // Friends-only posts
                { visibility: 'private', author: userId }, // User's own private posts
            ],
        };

        // Find posts, ensuring no duplicates by using `aggregate` with `$group`
        const posts = await Post.aggregate([
            { $match: query }, // Apply the filter query
            { $sort: { createdAt: -1 } }, // Sort by creation date
            { $skip: skip }, // Pagination: Skip posts
            { $limit: parseInt(limit) }, // Pagination: Limit posts
            {
                $group: {
                    _id: '$_id', // Group by unique post IDs
                    doc: { $first: '$$ROOT' }, // Keep the whole document
                },
            },
            { $replaceRoot: { newRoot: '$doc' } }, // Unwind the grouped document
        ]);

        // Populate required fields
        const populatedPosts = await Post.populate(posts, [
            { path: 'author', select: 'username profileImage' },
            { path: 'tags', select: 'username' },
            { path: 'reactions' },
            { path: 'comments' },
        ]);

        res.status(200).json(populatedPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    const { postId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Posts not found' });
        }
        
        await Reaction.deleteMany({ post: postId });
        await Comment.deleteMany({ post: postId });

        // Delete associated file from Cloudinary
        if (post.media && post.media.url) {
            const publicId = post.media.url.split('/').pop().split('.')[0]; // Extract publicId from URL
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Posts deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { postId, text, media, feeling } = req.body;
    const userId = req.user._id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Posts not found' });
        }
        if (!post.author.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        
        // Update post content
        post.text = text || post.text;
        // Update post feeling
        post.feeling = feeling || post.feeling;

        if (media) {
            // Delete the old file from Cloudinary
            if (post.media && post.media.url) {
                const oldPublicId = post.media.url.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(oldPublicId);
            }

            // Add the new media file
            post.media = media;
        }

        await post.save();
        
        res.status(200).json({ message: 'Posts updated successfully', post });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.createReaction = async (req, res) => {
    const { postId, type } = req.body;
    const userId = req.user._id
    const io = getIoInstance()
    try {
        const reaction = await Reaction.create({ type, user: userId, post: postId });
        const post = await Post.findById(postId);
        post.reactions.push(reaction);
        await post.save();

        if (post.author._id.toString() !== userId.toString()) {
            const notification = await Notification.create({
                user: post.author._id,
                actorId: userId,
                postId: postId,
                actionType: 'reaction',
                message: `${req.user.username} reacted to your post.`
            });

            io.to(post.author._id.toString()).emit('notification', {
                notification,
                actor: req.user
            });
        }

        res.status(200).json({ message: 'Reaction added', reaction });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.removeReaction = async (req, res) => {
    const { postId, reactionId } = req.body;
    const userId = req.user._id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Posts not found' });
        }

        const reaction = await Reaction.findById(reactionId);
        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        if (!reaction.user.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        post.reactions = post.reactions.filter((r) => r.toString() !== reactionId);
        await post.save();

        await Reaction.deleteOne({ _id: reactionId });

        res.status(200).json({ message: 'Reaction removed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReaction = async (req, res) => {
    const { postId, type } = req.body;
    const userId = req.user._id
    try {
        // Find the reaction by postId and user ID
        const reaction = await Reaction.findOne({ post: postId, user: userId });
        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        // Update reaction type
        reaction.type = type;
        await reaction.save();
        
        res.status(200).json({ message: 'Reaction updated successfully', reaction });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.createComment = async (req, res) => {
    const { postId, text } = req.body;
    const userId = req.user._id;
    const io = getIoInstance()

    try {
      const comment = await Comment.create({
        text,
        user: userId,
        post: postId
      });
  
      const post = await Post.findById(postId);
      post.comments.push(comment._id);
      await post.save();

        if (post.author._id.toString() !== userId.toString()) {
            const notification = await Notification.create({
                user: post.author._id, // Recipient
                actorId: userId, // Triggering user
                postId: postId, // Related post
                actionType: 'comment',
                message: `${req.user.username} commented on your post.`
            });

            // Emit notification
            io.to(post.author._id.toString()).emit('notification', {
                notification,
                actor: req.user // Send triggering user's details
            });
        }

      res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.body;
    const userId = req.user._id
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Posts not found' });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (!comment.user.equals(userId) && !post.author.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        post.comments = post.comments.filter((c) => c.toString() !== commentId);
        await post.save();

        await Comment.deleteOne({ _id: commentId });

        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { commentId, text } = req.body;
    const userId = req.user._id
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (!comment.user.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }
        
        // Update comment text
        comment.text = text;
        await comment.save();
        
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};