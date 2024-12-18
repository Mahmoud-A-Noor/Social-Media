const { Server } = require('socket.io');
const User = require('../models/User');

let io;
const activeStreams = new Map();

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

            socket.on('live-stream-start', ({ streamerId, streamData, notification }) => {
                console.log('Live stream start event received:', {
                    streamerId,
                    streamData,
                    notification
                });

                // Store stream information
                activeStreams.set(streamerId, {
                    streamData,
                    startTime: Date.now(),
                    isActive: true
                });
                console.log('Active streams:', Array.from(activeStreams.keys()));

                // Join streamer to their own room
                socket.join(`stream-${streamerId}`);
                console.log(`Streamer ${streamerId} joined room: stream-${streamerId}`);
                
                // Broadcast stream data to the room
                io.to(`stream-${streamerId}`).emit('stream-data', streamData);
                
                // Broadcast notification to all clients
                socket.broadcast.emit('notification', {
                    notification: {
                        actionType: 'live_stream',
                        message: streamData.text || 'Started a live stream',
                        actorId: { _id: streamerId },
                        status: 'pending',
                        createdAt: new Date(),
                        _id: `live-${Date.now()}-${streamerId}`
                    },
                    streamerId,
                    streamData
                });
            });

            socket.on('live-stream-chunk', ({ chunk, streamerId }) => {
                // Broadcast chunk to all viewers in this stream's room
                socket.to(`stream-${streamerId}`).emit('stream-chunk', { chunk });
            });

            socket.on('join-stream', ({ streamerId }) => {
                console.log(`User ${socket.id} joining stream:`, streamerId);
                socket.join(`stream-${streamerId}`);
                
                const streamInfo = activeStreams.get(streamerId);
                if (streamInfo?.isActive) {
                    console.log('Stream is active, sending data to new viewer');
                    socket.emit('stream-data', streamInfo.streamData);
                } else {
                    console.log('Stream not active for viewer join');
                }
            });

            socket.on('leave-stream', ({ streamerId }) => {
                socket.leave(`stream-${streamerId}`);
                // Optionally notify streamer about viewer leaving
                socket.to(`stream-${streamerId}`).emit('viewer-left', { 
                    viewerId: socket.handshake.query.userId 
                });
            });

            socket.on('live-stream-end', ({ streamerId }) => {
                console.log(`Stream ended for ${streamerId}`);
                activeStreams.delete(streamerId);
                io.to(`stream-${streamerId}`).emit('stream-ended');
            });

            socket.on('check-stream-status', ({ streamerId }, callback) => {
                console.log('Checking stream status for:', streamerId);
                console.log('Active streams:', Array.from(activeStreams.keys()));
                
                const streamInfo = activeStreams.get(streamerId);
                const response = {
                    isActive: streamInfo?.isActive || false,
                    streamData: streamInfo?.streamData
                };
                
                console.log('Sending stream status response:', response);
                callback(response);
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