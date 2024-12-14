const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/status/:userId', userController.getUserStatus);
router.get('/me', userController.getMyData);
router.post('/story', userController.addStory);
router.get('/story', userController.getStories);
router.get('/all', userController.getAllUsers);
router.get('/search', userController.searchUsers);

module.exports = router;