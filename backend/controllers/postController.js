const Post = require('../models/Post');
const User = require('../models/User');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');
const cloudinary = require("../config/cloudinary");
const { createNotification } = require('../utils/notificationHelper');



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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const currentUserId = req.user._id;

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'author',
                select: 'username profileImage followers'
            })
            .populate('reactions')
            .populate('comments')
            .populate({
                path: 'shares',
                populate: {
                    path: 'user',
                    select: 'username profileImage'
                }
            })
            .lean(); // Convert to plain JavaScript object for modification

        // Add isFollowing field to each post's author
        const postsWithFollowStatus = posts.map(post => ({
            ...post,
            author: {
                ...post.author,
                isFollowing: post.author.followers.some(
                    followerId => followerId.toString() === currentUserId.toString()
                )
            }
        }));

        // Remove the followers array as it's no longer needed in the response
        postsWithFollowStatus.forEach(post => {
            delete post.author.followers;
        });

        res.json({postsWithFollowStatus, hasMorePosts: postsWithFollowStatus.length >= limit});
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Error fetching posts' });
    }
};

exports.getPost = async (req, res) => {
    const {postId} = req.params
    console.log(postId);

    try {
        const post = await Post.findById(postId)
            .populate({
                path: 'author',
                select: 'username profileImage followers'
            })
            .populate('reactions')
            .populate('comments')
            .populate({
                path: 'shares',
                populate: {
                    path: 'user',
                    select: 'username profileImage'
                }
            })
            .lean(); // Convert to plain JavaScript object for modification

        // Add isFollowing field to each post's author
        const postWithFollowStatus = {
            ...post,
            author: {
                ...post.author,
                isFollowing: post.author.followers.some(
                    followerId => followerId.toString() === currentUserId.toString()
                )
            }
        };

        delete postWithFollowStatus.author.followers;

        res.status(200).json(postWithFollowStatus);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Error fetching post' });
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
    const { postId, type = 'public' } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Add share to post
        post.shares.push({
            user: userId,
            type,
            sharedAt: new Date()
        });
        await post.save();

        // Create notification if the share is not by the post author
        if (post.author.toString() !== userId.toString()) {
            await createNotification({
                userId: post.author,
                actorId: userId,
                postId,
                actionType: 'share',
                message: `${req.user.username} shared your post`
            });
        }

        res.status(200).json({ message: 'Post shared successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createReaction = async (req, res) => {
    const { postId, type } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user already reacted
        const existingReaction = await Reaction.findOne({
            post: postId,
            user: userId
        });

        if (existingReaction) {
            return res.status(400).json({ error: 'User already reacted to this post' });
        }

        // Create new reaction
        const reaction = await Reaction.create({
            type,
            user: userId,
            post: postId
        });

        // Add reaction to post
        post.reactions.push(reaction._id);
        await post.save();

        // Create notification if the reaction is not by the post author
        if (post.author.toString() !== userId.toString()) {
            await createNotification({
                userId: post.author,
                actorId: userId,
                postId,
                actionType: 'reaction',
                message: `${req.user.username} reacted to your post`
            });
        }

        res.status(201).json(reaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateReaction = async (req, res) => {
    const { postId, type } = req.body;
    const userId = req.user._id;

    try {
        // Find and update the reaction
        const reaction = await Reaction.findOneAndUpdate(
            { post: postId, user: userId },
            { type },
            { new: true }
        );

        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        res.status(200).json(reaction);
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

        // Find and remove the reaction
        const reaction = await Reaction.findOneAndDelete({
            post: postId,
            user: userId
        });

        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        // Remove reaction from post
        post.reactions = post.reactions.filter(
            reactionId => reactionId.toString() !== reaction._id.toString()
        );
        await post.save();

        res.status(200).json({ message: 'Reaction removed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    const { postId, text, parentId } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create the comment
        const newComment = await Comment.create({
            text,
            user: userId,
            post: postId,
            parent: parentId || null,
        });

        // Explicitly populate the user field
        const populatedComment = await Comment.findById(newComment._id)
            .populate({
                path: 'user',
                select: 'username profileImage'
            })
            .lean();
        

        if (!parentId) {
            post.comments.push(newComment._id);
            await post.save();

            if (post.author.toString() !== userId.toString()) {
                await createNotification({
                    userId: post.author,
                    actorId: userId,
                    postId: postId,
                    actionType: 'comment',
                    message: `${req.user.username} commented on your post`
                });
            }
        } else {
            const parentComment = await Comment.findById(parentId)
                .populate('user', 'username');

            if (parentComment && parentComment.user._id.toString() !== userId.toString()) {
                await createNotification({
                    userId: parentComment.user._id,
                    actorId: userId,
                    postId: postId,
                    actionType: 'comment',
                    message: `${req.user.username} replied to your comment`
                });
            }
        }

        // Send response with populated comment
        const response = { reply: populatedComment };
        
        res.status(201).json(response);

    } catch (error) {
        console.error('Error in createComment:', error);
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
