const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');

router.get('/status/:userId', userController.getUserStatus);
router.get('/me', userController.getMyData);
router.post('/story', userController.addStory);
router.get('/story', userController.getStories);

module.exports = router;