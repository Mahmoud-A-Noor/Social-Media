import { io } from 'socket.io-client';
import getUserIdFromToken from '../utils/getUserIdFromToken';


const socket = io(import.meta.env.VITE_API_BASE_URL, {
    query: { userId: getUserIdFromToken(localStorage.getItem('accessToken')) }, // Pass userId from localStorage
    transports: ['websocket'], // Optional: Force WebSocket connection
    autoConnect: true
});


// Debug socket connection
socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('notification', (data) => {
    console.log('Socket notification received:', data);
});


export default socket;