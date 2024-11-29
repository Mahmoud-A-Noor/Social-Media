import { io } from 'socket.io-client';
import getUserIdFromToken from '../utils/getUserIdFromToken';


const socket = io(import.meta.env.VITE_API_BASE_URL, {
    query: { userId: getUserIdFromToken(localStorage.getItem('accessToken')) } // Pass userId from localStorage
});

export default socket;