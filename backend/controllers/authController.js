const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateJWTokens } = require("../utils/CreateJWTokens")
const User = require('../models/User');
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const tokens = generateJWTokens(user);
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username, email }, tokens });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const tokens = generateJWTokens(user);

    res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.username, email: user.email }, tokens });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};


exports.refreshToken = async (req, res) => {
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

    res.json( tokens );
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
}