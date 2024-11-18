const express = require('express');
const socialController = require('../controllers/socialController');
const router = express.Router();

// Route for following a user
router.post('/:userId/follow', socialController.followUser);

// Route to unfollow a user
router.delete('/:userId/unfollow', socialController.unfollowUser);

// Route for adding a friend
router.post('/:userId/add-friend', socialController.addFriend);

// Route to unfriend a user
router.delete('/:userId/unfriend', socialController.unfriend);

// Route for blocking a user
router.post('/:userId/block', socialController.blockUser);

module.exports = router;