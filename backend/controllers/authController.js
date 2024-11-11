const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { generateJWTokens } = require("../utils/CreateJWTokens")
const User = require('../models/User');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

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
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const tokens = generateJWTokens(user);
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name, email }, tokens });
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

    res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email }, tokens });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};