const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { generateJWTokens } = require("../utils/CreateJWTokens")
const { check } = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    check('username').not().isEmpty().withMessage('Username is required').isLength({ min: 6 }).withMessage('Username length must be at least 6 characters'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

router.post('/login', [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').not().isEmpty().withMessage('Password is required')
], authController.login);


// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  // Generate a JWT token and send it back to the client
  const tokens = generateJWTokens(req.user);
    res.redirect(`http://localhost:5173/login/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
});

// Refresh Token
router.post('/refresh-token', authController.refreshToken);


module.exports = router;