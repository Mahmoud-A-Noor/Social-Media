import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from "../../../config/axios.js";
import socketService from '../../../config/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PulseBubbleLoader } from "react-loaders-kit";
import { formatDistanceToNow } from 'date-fns';
import notify from '../../../utils/notify';

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
        const actorName = notification.actorId?.username || 'Someone';
        
        switch (notification.actionType) {
            case 'live_stream':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            {getNotificationIcon(notification.actionType)}
                        </div>
                        <div>
                            <p className="font-semibold">{actorName} started a live stream</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
                
            case 'comment':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                        {getNotificationIcon(notification.actionType)}
                        </div>
                        <div>
                            <p className="font-semibold">{actorName} commented on your post</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
                
            case 'reaction':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                        {getNotificationIcon(notification.actionType)}
                        </div>
                        <div>
                            <p className="font-semibold">{actorName} reacted to your post</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
                
            // Add other notification types...
            default:
                return (
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                        {getNotificationIcon(notification.actionType)}
                        </div>
                        <div>
                            <p className="font-semibold">{notification.message}</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                );
        }
    };

    useEffect(() => {
        fetchNotifications();

        socketService.on('notification', (data) => {
            console.log('Received notification:', data);

            // Handle both direct notifications and live stream notifications
            const notificationData = data.notification || {
                _id: Date.now(), // Temporary ID for live stream notifications
                actionType: 'live_stream',
                message: `${data.streamData?.text || 'Started a live stream'}`,
                actorId: { _id: data.streamerId },
                status: 'pending',
                createdAt: new Date()
            };

            console.log('Processed notification data:', notificationData);

            setNotifications(prev => {
                // Check for duplicates using streamerId for live streams
                const isDuplicate = prev.some(n => 
                    (n._id === notificationData._id) || 
                    (n.actionType === 'live_stream' && n.actorId?._id === data.streamerId)
                );

                if (isDuplicate) {
                    console.log('Duplicate notification, skipping');
                    return prev;
                }

                console.log('Adding new notification to list');
                return [notificationData, ...prev];
            });

            setUnreadCount(prev => prev + 1);

            // Show notification toast
            if (data.streamData) {
                notify(`Someone started a live stream!`, 'info');
            }
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

    const handleNotificationClick = async (notification) => {
        try {
            console.log('Handling notification click:', notification);
            
            // Handle different notification types
            switch (notification.actionType) {
                case 'live_stream':
                    const streamerId = notification.actorId?._id;
                    if (streamerId) {
                        window.location.href = `/live/${streamerId}`;
                    }
                    break;
                    
                case 'comment':
                case 'reaction':
                case 'share':
                    //TODO (create page for post) Navigate to the post
                    if (notification.postId) {
                        window.location.href = `/post/${notification.postId}`;
                    }
                    break;
                    
                case 'friend_request':
                    //TODO (should be edited) Navigate to friend requests page or handle in-place
                    window.location.href = `/friends/requests`;
                    break;
                    
                case 'follow':
                case 'unfollow':
                case 'unfriend':
                case 'block':
                    //TODO (create page for profile) Navigate to user profile
                    if (notification.actorId?._id) {
                        window.location.href = `/profile/${notification.actorId._id}`;
                    }
                    break;
                    
                default:
                    console.warn('Unknown notification type:', notification.actionType);
            }
            
            // Mark as read if it has an _id (not a temporary live stream notification)
            if (notification._id) {
                await axiosInstance.put(`/notifications/${notification._id}/mark-read`);
                setNotifications(prev => 
                    prev.map(n => 
                        n._id === notification._id 
                            ? { ...n, status: 'read' }
                            : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
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
                            onClick={() => handleNotificationClick(notification)}
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