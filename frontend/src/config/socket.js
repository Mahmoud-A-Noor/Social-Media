
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_STATUS_API_URL, {
    query: { userId: localStorage.getItem('userId') } // Pass userId from localStorage
});

export default socket;