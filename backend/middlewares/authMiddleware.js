const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'Authorization token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // Attach user to request
    if (!req.user) return res.status(404).json({ message: 'User not found' });
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;