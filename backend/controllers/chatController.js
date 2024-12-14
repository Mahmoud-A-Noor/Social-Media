const Chat = require('../models/Chat');
const User = require('../models/User');

exports.createOrGetChat = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        // Check if chat already exists
        const existingChat = await Chat.findOne({
            participants: {
                $all: [currentUserId, userId],
                $size: 2
            }
        })
        .populate('participants', 'username profileImage status')
        .populate('lastMessage');

        if (existingChat) {
            // Get unread count for current user
            const currentUser = await User.findById(currentUserId);
            const unreadCount = currentUser.unreadMessages?.get(existingChat._id.toString()) || 0;
            
            return res.status(200).json({
                ...existingChat.toObject(),
                unreadCount
            });
        }

        // If no chat exists, create new one
        const newChat = await Chat.create({
            participants: [currentUserId, userId]
        });

        // Populate the participants
        const populatedChat = await Chat.findById(newChat._id)
            .populate('participants', 'username profileImage status')
            .populate('lastMessage');

        // Add chat to both users' chats array
        await User.updateMany(
            { _id: { $in: [currentUserId, userId] } },
            { $addToSet: { chats: newChat._id } }
        );

        res.status(201).json({ ...populatedChat.toObject(), unreadCount: 0 });
    } catch (error) {
        console.error('Error in createOrGetChat:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

exports.getMyChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user.id
        })
        .populate('participants', 'username profileImage status')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('participants', 'username profileImage status')
            .populate('lastMessage');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Check if user is participant
        if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to access this chat' });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 