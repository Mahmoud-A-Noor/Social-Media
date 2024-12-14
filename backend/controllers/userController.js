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

        // SendButton user data as response
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

        // Fetch the user and populate friends and following
        const user = await User.findById(userId).populate('friends following', 'username story');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        // Initialize a map to ensure unique stories
        const uniqueStoriesMap = new Map();

        // Add the logged-in user's story if it exists and was added today
        if (
            user.story?.url &&
            user.story?.addedAt &&
            new Date(user.story.addedAt) >= startOfToday
        ) {
            uniqueStoriesMap.set(user._id.toString(), {
                username: user.username,
                story: user.story,
            });
        }

        // Add stories from friends and following
        [...user.friends, ...user.following].forEach(friend => {
            if (
                friend.story?.url &&
                friend.story?.addedAt &&
                new Date(friend.story.addedAt) >= startOfToday
            ) {
                uniqueStoriesMap.set(friend._id.toString(), {
                    username: friend.username,
                    story: friend.story,
                });
            }
        });

        // Convert the Map values to an array
        const allStories = Array.from(uniqueStoriesMap.values());

        res.status(200).json(allStories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        
        // Get the current user with populated friends
        const currentUser = await User.findById(currentUserId)
            .populate({
                path: 'friends',
                select: 'username profileImage status lastSeen unreadMessages',
                match: { 
                    _id: { $nin: req.user.blockedUsers }
                }
            })
            .lean();

        if (!currentUser || !currentUser.friends) {
            return res.status(200).json([]);
        }

        // Process and sort friends
        const friendsWithMetadata = currentUser.friends.map(friend => ({
            ...friend,
            // Handle unreadMessages as a plain object
            unreadMessages: friend.unreadMessages ? 
                Object.values(friend.unreadMessages).reduce((a, b) => a + b, 0) : 0
        }));

        // Sort friends:
        // 1. Friends with unread messages (sorted by number of unread messages)
        // 2. Online friends
        // 3. Offline friends (sorted by lastSeen)
        const sortedFriends = friendsWithMetadata.sort((a, b) => {
            // First priority: unread messages
            if (a.unreadMessages !== b.unreadMessages) {
                return b.unreadMessages - a.unreadMessages;
            }
            
            // Second priority: online status
            if (a.status !== b.status) {
                return a.status === 'online' ? -1 : 1;
            }
            
            // Third priority: for offline users, sort by lastSeen
            if (a.status === 'offline' && b.status === 'offline') {
                return new Date(b.lastSeen) - new Date(a.lastSeen);
            }
            
            // Finally, sort by username
            return a.username.localeCompare(b.username);
        });

        res.status(200).json(sortedFriends);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user.id;

        const users = await User.find({
            username: { $regex: query, $options: 'i' },
            _id: { 
                $ne: currentUserId,
                $nin: req.user.blockedUsers 
            }
        })
        .select('username profileImage status')
        .limit(10);

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};