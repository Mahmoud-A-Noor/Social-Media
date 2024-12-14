const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  updateMessageStatus,
  markMessagesAsRead
} = require('../controllers/MessageController');

router.post('/', sendMessage);
router.get('/:chatId', getMessages);
router.patch('/:messageId/status', updateMessageStatus);
router.put('/read/:chatId', markMessagesAsRead);

module.exports = router;
