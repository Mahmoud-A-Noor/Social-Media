const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


router.get('/:profileId', profileController.getUserProfile);
router.get('/:profileId/posts', profileController.getUserPosts);
router.get('/:profileId/friends', profileController.getUserFriends);
router.get('/:profileId/followers', profileController.getUserFollowers);
router.put('/update-profile', profileController.updateProfile);

module.exports = router;