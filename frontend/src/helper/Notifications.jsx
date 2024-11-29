import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../config/socket';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    const markAllAsRead = () => {
        axios.post('/notifications/mark-read')
            .then(() => {
                setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
            })
            .catch(console.error);
    };

    useEffect(() => {
        // Listen for real-time notifications
        socket.on('notification', ({ notification, actor }) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        // Fetch existing notifications
        axios.get('/notifications')
            .then((res) => setNotifications(res.data))
            .catch(console.error);

        return () => socket.off('notification');
    }, []);

    return (
        <div>
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification._id}>
                        <a href={`/posts/${notification.postId}`}>
                            {notification.actorId.username} {notification.message}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;