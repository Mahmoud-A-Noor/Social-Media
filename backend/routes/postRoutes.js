const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();



// Routes for post actions
router.post('/', postController.createPost);          // Create a post
router.delete('/', postController.deletePost);        // Delete a post
router.put('/', postController.updatePost);

// Routes for reaction actions
router.post('/reactions', postController.createReaction);   // Add a reaction
router.delete('/reactions', postController.removeReaction);  // Remove a reaction
router.put('/reactions', postController.updateReaction);

// Routes for comment actions
router.post('/comments', postController.createComment);      // Add a comment
router.delete('/comments', postController.deleteComment); // Remove a comment
router.put('/comments', postController.updateComment);



module.exports = router;