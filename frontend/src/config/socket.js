import { io } from 'socket.io-client';
import getUserIdFromToken from '../utils/getUserIdFromToken';


const socket = io(import.meta.env.VITE_API_BASE_URL, {
    query: { userId: getUserIdFromToken(localStorage.getItem('accessToken')) }, // Pass userId from localStorage
    transports: ['websocket'], // Optional: Force WebSocket connection
});

// Optional: Handle connection errors
socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
});

export default socket;