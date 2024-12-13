const { Server } = require('socket.io');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        const userId = socket.handshake.query.userId;

        if (userId && userId !== 'null' && userId !== 'undefined') {
            // Join the user to a room named after their userId
            socket.join(userId);

            // Mark user as online
            updateUserStatus(userId, 'online');

            // Notify others about the status change
            socket.broadcast.emit('user-status-change', { id: userId, status: 'online' });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                if (userId && userId !== 'null' && userId !== 'undefined') {
                    updateUserStatus(userId, 'offline');

                    // Notify others about the status change
                    socket.broadcast.emit('user-status-change', { id: userId, status: 'offline' });
                }
            });
        }
    });

    const updateUserStatus = async (userId, status) => {
        try {
            if (!userId || userId === 'null' || userId === 'undefined') {
                console.log('Invalid userId for status update:', userId);
                return;
            }
            await User.findByIdAndUpdate(userId, { status }, { new: true });
        } catch (error) {
            console.error(`Error updating user status: ${error.message}`);
        }
    };

    return io;
};

const getIoInstance = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};

module.exports = { initializeSocket, getIoInstance };