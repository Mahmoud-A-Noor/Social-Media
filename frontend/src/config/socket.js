
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL, {
    query: { userId: localStorage.getItem('userId') } // Pass userId from localStorage
});

export default socket;