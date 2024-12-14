import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../../config/axios.js";
import socketService from '../../../config/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PulseBubbleLoader } from "react-loaders-kit";
import { formatDistanceToNow } from 'date-fns';

const NotificationsDropdown = ({ isOpen, setUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const PAGE_SIZE = 10;

    const fetchNotifications = useCallback(async () => {
        if (loading) return;
        
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/notifications?page=${page}&limit=${PAGE_SIZE}`);
            const newNotifications = response.data.notifications;
            
            setNotifications(prev => {
                const existingIds = new Set(prev.map(n => n._id));
                const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n._id));
                return [...prev, ...uniqueNewNotifications];
            });

            setHasMore(newNotifications.length === PAGE_SIZE);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading]);

    const handleFriendRequest = async (notificationId, accept) => {
        try {
            await axiosInstance.post('/social/respond-friend-request', {
                notificationId,
                accept
            });
            
            setNotifications(prev => prev.map(notif => 
                notif._id === notificationId 
                    ? {...notif, status: accept ? 'accepted' : 'declined'}
                    : notif
            ));
        } catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

    const getNotificationIcon = (actionType) => {
        switch (actionType) {
            case 'friend_request':
                return '👥';
            case 'follow':
                return '👤';
            case 'reaction':
                return '❤️';
            case 'comment':
                return '💬';
            case 'share':
                return '🔄';
            case 'block':
                return '🚫';
            default:
                return '📢';
        }
    };

    const renderNotificationContent = (notification) => {
        const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

        return (
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                        {getNotificationIcon(notification.actionType)}
                    </span>
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>
                </div>
                {notification.actionType === 'friend_request' && notification.status === 'pending' && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleFriendRequest(notification._id, true)}
                            className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleFriendRequest(notification._id, false)}
                            className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Decline
                        </button>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        fetchNotifications();

        socketService.on('notification', ({ notification, actor }) => {
            setNotifications(prev => {
                if (prev.some(n => n._id === notification._id)) {
                    return prev;
                }
                return [{
                    ...notification,
                    actor,
                    isNew: true
                }, ...prev];
            });

            setTimeout(() => {
                setNotifications(prev => 
                    prev.map(n => n._id === notification._id ? { ...n, isNew: false } : n)
                );
            }, 3000);
        });

        return () => {
            socketService.off('notification');
        };
    }, []);

    const markAllAsRead = async () => {
        try {
            await axiosInstance.put('/notifications/mark-read');
            setNotifications(prev => 
                prev.map(notification => ({ 
                    ...notification, 
                    status: 'read' 
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const handleNotificationClick = async (notificationId) => {
        try {
            await axiosInstance.put(`/notifications/${notificationId}/mark-read`);
            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, status: 'read' }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className={`
            absolute w-[23em] top-[2.5em] -left-[20.5em] 
            shadow-[0px_0px_5px_0.1px_rgba(0,_0,_0,_0.75)] 
            bg-white rounded-md z-[99999]
            transition-all duration-300 origin-top
            ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
        `}>
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:text-blue-600"
                >
                    Mark all as read
                </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <InfiniteScroll
                    dataLength={notifications.length}
                    next={fetchNotifications}
                    hasMore={hasMore}
                    loader={
                        <div className="flex justify-center p-4">
                            <PulseBubbleLoader size={30} colors="#3B82F6" loading={true} />
                        </div>
                    }
                    endMessage={
                        <p className="py-4 text-center text-gray-500">
                            No more notifications
                        </p>
                    }
                    scrollableTarget="notifications-scroll"
                >
                    {notifications.map((notification, index) => (
                        <div
                            key={`${notification._id}-${index}`}
                            onClick={() => handleNotificationClick(notification._id)}
                            className={`
                                p-4 border-b transition-all duration-300 cursor-pointer
                                ${notification.status !== 'read' ? 'bg-blue-50' : 'bg-white'}
                                ${notification.isNew ? 'animate-pulse bg-green-50' : ''}
                                hover:bg-gray-50
                            `}
                        >
                            {renderNotificationContent(notification)}
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default NotificationsDropdown; 