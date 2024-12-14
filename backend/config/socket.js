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
            socket.join(userId);
            updateUserStatus(userId, 'online');
            socket.broadcast.emit('user-status-change', { id: userId, status: 'online' });

            // Handle typing events
            socket.on('typing', ({ chatId }) => {
                socket.to(chatId).emit('user-typing', { chatId, user: userId });
            });

            socket.on('stop-typing', ({ chatId }) => {
                socket.to(chatId).emit('user-stop-typing', { chatId, user: userId });
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
                if (userId) {
                    updateUserStatus(userId, 'offline');
                    socket.broadcast.emit('user-status-change', { id: userId, status: 'offline' });
                }
            });
        }
    });

    return io;
};

const getIoInstance = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};

const updateUserStatus = async (userId, status) => {
    try {
        if (!userId || userId === 'null' || userId === 'undefined') {
            console.log('Invalid userId for status update:', userId);
            return;
        }
        await User.findByIdAndUpdate(userId, { 
            status,
            lastSeen: status === 'offline' ? Date.now() : undefined
        });
    } catch (error) {
        console.error(`Error updating user status: ${error.message}`);
    }
};

module.exports = { initializeSocket, getIoInstance };