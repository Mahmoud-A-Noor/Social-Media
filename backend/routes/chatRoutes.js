const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/', chatController.createOrGetChat);
router.get('/', chatController.getMyChats);
router.get('/:chatId', chatController.getChatById);

module.exports = router; 