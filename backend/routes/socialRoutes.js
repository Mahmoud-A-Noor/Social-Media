const express = require('express');
const socialController = require('../controllers/socialController');
const router = express.Router();

// Route for following a user
router.post('/follow', socialController.followUser);

// Route to unfollow a user
router.delete('/unfollow', socialController.unfollowUser);

// Route for adding a friend
router.post('/add-friend', socialController.addFriend);

// Route to unfriend a user
router.delete('/unfriend', socialController.unfriend);

// Route for blocking a user
router.post('/block', socialController.blockUser);

module.exports = router;