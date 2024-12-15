const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { getIoInstance } = require('../config/socket');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const sender = req.user._id;

    const message = await Message.create({
      chatId,
      sender,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profileImage status')
      .populate('chatId');

    // Emit the message to all users in the chat, including sender
    const io = getIoInstance();
    const chat = await Chat.findById(chatId);

    chat.participants.forEach(participantId => {
      io.to(participantId.toString()).emit('new-message', populatedMessage);
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    // Get total count for pagination
    const totalCount = await Message.countDocuments({ chatId });
    
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'name avatar');

    res.status(200).json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: totalCount > page * limit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Update all unread messages in this chat to 'read'
    await Message.updateMany(
      { 
        chatId,
        sender: { $ne: userId },
        status: { $ne: 'read' }
      },
      { status: 'read' }
    );

    // Clear unread count for this chat
    const user = await User.findById(userId);
    if (user.unreadMessages) {
      user.unreadMessages.delete(chatId);
      await user.save();
    }

    const io = getIoInstance();
    io.to(chatId).emit('messages-read', { chatId });

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: error.message });
  }
};
