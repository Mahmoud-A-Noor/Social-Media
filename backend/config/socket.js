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

            socket.on('live-stream-start', ({ streamerId, streamData }) => {
                // Join streamer to their own room
                socket.join(`stream-${streamerId}`);
                
                // Notify followers/friends based on visibility
                socket.broadcast.emit('new-live-stream', { 
                    streamerId, 
                    streamData 
                });
            });

            socket.on('live-stream-chunk', ({ chunk, streamerId }) => {
                // Broadcast chunk to all viewers in this stream's room
                socket.to(`stream-${streamerId}`).emit('stream-chunk', { chunk });
            });

            socket.on('join-stream', ({ streamerId }) => {
                socket.join(`stream-${streamerId}`);
                // Optionally notify streamer about new viewer
                socket.to(`stream-${streamerId}`).emit('viewer-joined', { 
                    viewerId: socket.handshake.query.userId 
                });
            });

            socket.on('leave-stream', ({ streamerId }) => {
                socket.leave(`stream-${streamerId}`);
                // Optionally notify streamer about viewer leaving
                socket.to(`stream-${streamerId}`).emit('viewer-left', { 
                    viewerId: socket.handshake.query.userId 
                });
            });

            socket.on('live-stream-end', ({ streamerId }) => {
                // Notify all viewers in the stream room that stream has ended
                io.to(`stream-${streamerId}`).emit('stream-ended', { streamerId });
                // Clean up the room
                const room = io.sockets.adapter.rooms.get(`stream-${streamerId}`);
                if (room) {
                    for (const clientId of room) {
                        io.sockets.sockets.get(clientId).leave(`stream-${streamerId}`);
                    }
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