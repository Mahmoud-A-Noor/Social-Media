import { useState, useEffect, useRef } from 'react';
import { FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Messages from './Messages';
import ChatInput from './ChatInput';
import socketService from '../../config/socket';
import axiosInstance from '../../config/axios';
import notify from '../../utils/notify';
import getUserIdFromToken from '../../utils/getUserIdFromToken';

const Messenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const messengerRef = useRef(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUserId = getUserIdFromToken(localStorage.getItem('accessToken'));

  // Fetch users and their status
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/user/all');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        notify('Failed to fetch users', 'error');
      }
    };

    fetchUsers();
  }, []);

  // Listen for socket events
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log('New message received:', newMessage);

      setMessages(prev => {
        const chatMessages = [...(prev[newMessage.chatId] || [])];
        if (!chatMessages.some(msg => msg._id === newMessage._id)) {
          chatMessages.unshift(newMessage);
        }
        return {
          ...prev,
          [newMessage.chatId]: chatMessages
        };
      });

      if (newMessage.sender.toString() !== currentUserId && 
          (!isOpen || (currentChat && currentChat._id.toString() !== newMessage.chatId.toString()))) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleTyping = ({ chatId, userId }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), userId]
        }));
      }
    };

    const handleStopTyping = ({ chatId, userId }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => ({
          ...prev,
          [chatId]: (prev[chatId] || []).filter(id => id !== userId)
        }));
      }
    };

    socketService.on('new-message', handleNewMessage);
    socketService.on('typing', handleTyping);
    socketService.on('stop-typing', handleStopTyping);

    socketService.on('user-status-change', ({ id, status }) => {
      setUsers(prev => prev.map(user => 
        user._id === id ? { ...user, status } : user
      ));
    });

    return () => {
      socketService.off('new-message', handleNewMessage);
      socketService.off('typing', handleTyping);
      socketService.off('stop-typing', handleStopTyping);
      socketService.off('user-status-change');
    };
  }, [isOpen, currentChat, currentUserId]);

  // Handle sending message
  const handleSendMessage = async (chatId, content) => {
    try {
      const response = await axiosInstance.post(`/messages`, { content, chatId });
      
      // Optimistically update messages state with the new message
      setMessages(prev => ({
        ...prev,
        [chatId]: [response.data, ...(prev[chatId] || [])]
      }));

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      notify('Failed to send message', 'error');
      throw error;
    }
  };

  // Handle chat opening
  const handleOpenChat = async (user) => {
    try {
      const response = await axiosInstance.post('/chats', { userId: user._id });
      setCurrentChat(response.data);
      
      // Fetch initial messages
      const messagesResponse = await axiosInstance.get(`/messages/${response.data._id}?page=1&limit=20`);
      
      setMessages(prev => {
        const newMessages = {
          ...prev,
          [response.data._id]: messagesResponse.data.messages
        };
        return newMessages;
      });

      if (response.data._id) {
        await axiosInstance.put(`/messages/read/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      notify('Failed to open chat', 'error');
    }
  };

  // Sort users by unread messages, online status, and then alphabetically
  const sortedUsers = [...users].sort((a, b) => {
    if (a.unreadMessages !== b.unreadMessages) {
      return b.unreadMessages - a.unreadMessages;
    }
    if (a.status !== b.status) {
      return a.status === 'online' ? -1 : 1;
    }
    return a.username.localeCompare(b.username);
  });

  // Add this useEffect for body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Add this useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messengerRef.current && 
        !messengerRef.current.contains(event.target) &&
        !event.target.closest('button') // This prevents closing when clicking the messenger button
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex h-screen">
      {/* Floating Button with Unread Count */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        className="fixed z-[999999] p-4 text-white bg-blue-500 rounded-full shadow-lg bottom-6 right-6 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaComments size={24} />
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -right-2">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={messengerRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed z-50 flex overflow-hidden bg-white rounded-lg shadow-xl bottom-24 right-6
                     w-[95vw] h-[80vh] max-w-[800px] max-h-[600px]
                     sm:w-[85vw] 
                     md:w-[75vw]
                     lg:w-[800px]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute z-10 p-2 text-2xl text-gray-600 hover:text-gray-800 right-2 top-2"
            >
              ×
            </button>

            {/* Users List */}
            <div className="flex flex-col w-full max-w-[280px] border-r sm:w-64">
              <div className="p-4 text-white bg-blue-500">
                <h3 className="font-semibold">Friends</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sortedUsers.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleOpenChat(user)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full">
                        {user.profileImage && (
                          <img 
                            src={user.profileImage} 
                            alt={user.username}
                            className="object-cover w-full h-full rounded-full"
                          />
                        )}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.username}</p>
                      <p className="text-xs text-gray-500">
                        {user.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    {user.unreadCount > 0 && (
                      <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col flex-1 min-w-0">
              {currentChat ? (
                <>
                  <div className="flex items-center justify-between p-4 text-white bg-blue-500">
                    <h3 className="font-semibold truncate">
                      {currentChat.participants.find(p => p._id.toString() !== currentUserId)?.username}
                    </h3>
                  </div>
                  <div className="flex flex-col flex-1 min-h-0">
                    <Messages 
                      chatId={currentChat._id} 
                      messages={messages[currentChat._id] || []} 
                    />
                    <ChatInput 
                      chatId={currentChat._id} 
                      onSendMessage={handleSendMessage}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1 text-gray-500">
                  Select a friend to start chatting
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messenger; 