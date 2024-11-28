import React, { useEffect, useState } from 'react';
import socket from '../config/socket';
import axios from "axios";

const FriendsList = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch friends from API
        axios.get('/user/friends')
            .then(response => setFriends(response.data))
            .catch(error => console.error('Error fetching friends:', error));

        // Listen for real-time status updates
        socket.on('user-status-change', (updatedUser) => {
            setFriends((prevFriends) =>
                prevFriends.map(friend =>
                    friend.id === updatedUser.id ? { ...friend, status: updatedUser.status } : friend
                )
            );
        });

        return () => socket.off('user-status-change');
    }, []);

    return (
        <div>
            {friends.map(friend => (
                <div key={friend.id}>
                    {friend.name} - {friend.status}
                </div>
            ))}
        </div>
    );
};

export default FriendsList;