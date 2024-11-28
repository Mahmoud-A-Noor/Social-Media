const { Server } = require('socket.io'); // Correct way to import the Socket.io server
const User = require('../models/User');

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL, // Replace with your frontend's URL
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        const userId = socket.handshake.query.userId;

        if (userId) {
            // Mark user as online
            updateUserStatus(userId, 'online');

            // Notify others about the status change
            socket.broadcast.emit('user-status-change', { id: userId, status: 'online' });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                updateUserStatus(userId, 'offline');

                // Notify others about the status change
                socket.broadcast.emit('user-status-change', { id: userId, status: 'offline' });
            });
        }
    });

    const updateUserStatus = async (userId, status) => {
        try {
            await User.findByIdAndUpdate(userId, { status }, { returnOriginal: false });
        } catch (error) {
            console.error(`Error updating user status: ${error.message}`);
        }
    };

    return io;
};

module.exports = initializeSocket;