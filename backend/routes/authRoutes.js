const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateJWTokens } = require("../utils/CreateJWTokens")
const { check } = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

router.post('/login', [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').not().isEmpty().withMessage('Password is required')
], authController.login);


// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Generate a JWT token and send it back to the client
  const tokens = generateJWTokens(req.user);
  res.json({ user: req.user, tokens });
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a new access token
    const tokens = generateJWTokens(user);

    res.json({ tokens });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});


module.exports = router;