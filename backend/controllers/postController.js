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

        // Query to filter posts based on visibility, shares, and blocked users
        const query = {
            $or: [
                {
                    visibility: 'public'
                }, // Public posts
                {
                    visibility: 'friends',
                    author: { $in: currentUser.friends }
                }, // Friends-only posts
                {
                    visibility: 'private',
                    author: userId
                }, // User's own private posts
                {
                    'shares.user': userId,
                    'shares.type': { $in: ['public', 'friends'] }
                } // Posts shared with the current user
            ],
            _id: { $nin: currentUser.hiddenPosts }, // Exclude hidden posts
            author: { $nin: currentUser.blockedUsers }, // Exclude blocked users
        };

        // Find posts with pagination
        const posts = await Post.find(query)
            .sort({ createdAt: -1 }) // Sort by creation date
            .skip(skip)
            .limit(parseInt(limit))
            .populate([
                { path: 'author', select: 'username profileImage' },
                { path: 'reactions' },
                { path: 'comments' },
                { path: 'shares.user', select: 'username profileImage' }
            ]);

        res.status(200).json(posts);
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

exports.savePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Find the user and update their savedPosts
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent duplicates
        if (user.savedPosts.includes(postId)) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        user.savedPosts.push(postId);
        await user.save();

        res.status(200).json({ message: 'Post saved successfully', savedPosts: user.savedPosts });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.hidePost = async (req, res) => {
    try {
        const { postId } = req.body; // ID of the post to hide
        const userId = req.user.id; // Authenticated user ID

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the post to hiddenPosts if not already hidden
        if (!user.hiddenPosts.includes(postId)) {
            user.hiddenPosts.push(postId);
            await user.save();
        }

        res.status(200).json({ message: 'Post hidden successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error hiding post', error: error.message });
    }
};

exports.sharePost = async (req, res) => {
    const { postId, type } = req.body; // `type` can be 'public' or 'friends'
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Find an existing share by the same user for the same type
        const existingShare = post.shares.find(
            (share) => share.user.equals(userId) && share.type === type
        );

        if (existingShare) {
            // Update the share date if it already exists
            existingShare.sharedAt = new Date();
        } else {
            // Add a new share entry
            post.shares.push({ user: userId, type });
        }

        await post.save();

        res.status(200).json({ message: 'Post shared successfully', post });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    const { postId } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const reaction = await Reaction.findOne({ post: postId, user: userId });
        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        // Remove the reaction from the post's reactions
        post.reactions = post.reactions.filter((r) => !r.equals(reaction._id));
        await post.save();

        // Delete the reaction
        await Reaction.deleteOne({ _id: reaction._id });

        res.status(200).json({ message: 'Reaction removed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReaction = async (req, res) => {
    const { postId, type } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Find the reaction by postId and user ID
        let reaction = await Reaction.findOne({ post: postId, user: userId });
        if (!reaction) {
            // If no reaction exists, create a new one
            reaction = new Reaction({ type, user: userId, post: postId });
            post.reactions.push(reaction._id);
            await post.save();
        } else {
            // Update the existing reaction's type
            reaction.type = type;
        }

        await reaction.save();

        res.status(200).json({ message: 'Reaction updated successfully', reaction });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    const { postId, text, parentId } = req.body; // parentId for replies
    const userId = req.user._id;
    const io = getIoInstance();

    try {
        const comment = await Comment.create({
            text,
            user: userId,
            post: postId,
            parent: parentId || null,
        });

        // Populate the user field for the comment
        const populatedComment = await Comment.findById(comment._id).populate('user', 'username');

        if (!parentId) {
            const post = await Post.findById(postId);
            post.comments.push(populatedComment._id);
            await post.save();
        }

        if (!parentId) {
            const post = await Post.findById(postId);
            if (post.author._id.toString() !== userId.toString()) {
                const notification = await Notification.create({
                    user: post.author._id,
                    actorId: userId,
                    postId: postId,
                    actionType: 'comment',
                    message: `${req.user.username} commented on your post.`,
                });

                io.to(post.author._id.toString()).emit('notification', {
                    notification,
                    actor: req.user,
                });
            }
        }

        // Send the populated comment as the response
        res.status(201).json({ message: 'Comment added', reply: populatedComment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getComments = async (req, res) => {
    const { postId, page = 1, limit = 10 } = req.query; // Pagination params
    try {
        // Fetching comments for the post
        const comments = await Comment.find({ post: postId, parent: null })
            .populate('user', 'username') // Populate the user field
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Fetching replies for each comment
        const commentsWithReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await Comment.find({ parent: comment._id })
                .populate('user', 'username')
                .sort({ createdAt: -1 })
                .limit(5); // Limit the number of replies
            return { ...comment.toObject(), replies };
        }));

        res.status(200).json({ comments: commentsWithReplies });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getReplies = async (req, res) => {
    const { commentId, page = 1, limit = 5 } = req.query; // Pagination for replies
    try {
        // Fetching replies based on parentId
        const replies = await Comment.find({ parent: commentId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({ replies });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.body;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'CommentButton not found' });
        }

        if (!comment.user.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        await Comment.deleteOne({ _id: commentId });
        await Comment.deleteMany({ parent: commentId }); // Delete replies

        res.status(200).json({ message: 'CommentButton deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { commentId, text } = req.body;
    const userId = req.user._id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'CommentButton not found' });
        }
        if (!comment.user.equals(userId)) {
            return res.status(403).json({ error: 'Unauthorized action' });
        }

        comment.text = text;
        await comment.save();

        res.status(200).json({ message: 'CommentButton updated successfully', comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};