const User = require("../models/User");


exports.getUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ status: user.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getMyData = async (req, res) => {
    try {
        // Access user ID from the decoded token
        const userId = req.user.id;

        // Find the user by ID in the database
        const user = await User.findById(userId).select('-password'); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user data as response
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};