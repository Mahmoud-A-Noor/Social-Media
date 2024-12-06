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

exports.addStory = async (req, res) => {
    const { storyUrl } = req.body;
    try {
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update story and timestamp
        user.story = {
            url: storyUrl,
            addedAt: new Date()
        };

        await user.save();

        res.status(200).json({ message: 'Story added successfully', story: user.story });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStories = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        // Convert the query params to integers
        const limitStories = parseInt(limit);
        const skip = (parseInt(page) - 1) * limitStories;

        // Find the user and populate friends and following
        const user = await User.findById(userId).populate('friends following', 'username story');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the current date (start of the day)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Use a Map to track unique stories by user ID
        const uniqueStoriesMap = new Map();

        [...user.friends, ...user.following].forEach(friend => {
            if (
                friend.story?.url &&
                friend.story?.addedAt &&
                new Date(friend.story.addedAt) >= startOfToday
            ) {
                uniqueStoriesMap.set(friend._id.toString(), {
                    username: friend.username,
                    story: friend.story
                });
            }
        });

        // Convert the Map values to an array and apply pagination
        const allStories = Array.from(uniqueStoriesMap.values());
        const paginatedStories = allStories.slice(skip, skip + limitStories);

        // Respond with paginated stories
        res.status(200).json(paginatedStories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};