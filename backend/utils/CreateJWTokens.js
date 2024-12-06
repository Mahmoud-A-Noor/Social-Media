const jwt = require('jsonwebtoken');

const generateJWTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' }); // Short-lived access token
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Long-lived refresh token
    return { accessToken, refreshToken };
};


module.exports = { generateJWTokens };
