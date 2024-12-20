const express = require('express');
const socialController = require('../controllers/socialController');
const router = express.Router();

// Route for following a user
router.post('/follow', socialController.followUser);

// Route to unfollow a user
router.delete('/unfollow', socialController.unfollowUser);

// Route for adding a friend
router.post('/friend-request', socialController.sendFriendRequest);

// Route for getting a friend requests
router.get('/get-friend-requests', socialController.getFriendRequests);

// Route to respond to friend request
router.post('/respond-friend-request', socialController.respondToFriendRequest);

// Route to unfriend a user
router.delete('/unfriend', socialController.unfriend);

// Route for blocking a user
router.post('/block', socialController.blockUser);

// Route to unblock a user
router.post('/unblock', socialController.unblockUser);

module.exports = router;