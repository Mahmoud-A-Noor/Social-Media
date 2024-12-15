import { useEffect, useRef, useState } from 'react';
import { BarsLoader } from 'react-loaders-kit';
import getUserIdFromToken from '../../utils/getUserIdFromToken';
import notify from '../../utils/notify';
import InfiniteScroll from 'react-infinite-scroll-component';

const Messages = ({ chatId, messages }) => {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const currentUserId = getUserIdFromToken(localStorage.getItem('accessToken'));
  const MESSAGES_PER_PAGE = 20;

  const loaderProps = {
    loading: true,
    size: 35,
    duration: 1,
    colors: ['#51E5FF', '#7DE2D1', '#FF7E6B']
  };

  useEffect(() => {
    // Initialize displayed messages based on the first page
    const initialMessages = messages.slice(0, MESSAGES_PER_PAGE);
    setDisplayedMessages(initialMessages);
    setHasMore(messages.length > MESSAGES_PER_PAGE);
    setPage(1);
  }, [messages]);

  const fetchMoreMessages = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const start = nextPage * MESSAGES_PER_PAGE;
      const end = start + MESSAGES_PER_PAGE;
      const newMessages = messages.slice(start, end);
      
      if (newMessages.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedMessages(prev => [...prev, ...newMessages]);
        setPage(nextPage);
        setHasMore(messages.length > end);
      }
    } catch (error) {
      console.error('Error fetching more messages:', error);
      notify('Failed to load more messages', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <InfiniteScroll
        dataLength={displayedMessages.length}
        next={fetchMoreMessages}
        hasMore={hasMore}
        loader={
          <div className="flex items-center justify-center p-4">
            <BarsLoader {...loaderProps} />
          </div>
        }
        inverse={true}
        className="flex flex-col-reverse"
        height="calc(100vh - 280px)"
        id="messageContainer"
        endMessage={
          <div className="py-2 text-center text-gray-500">
            No more messages
          </div>
        }
      >
        <div 
          className="flex flex-col-reverse p-4 space-y-4 space-y-reverse"
        >
          {displayedMessages.map((message) => (
            <MessageBubble 
              key={message._id}
              message={message} 
              isOwn={message.sender._id === currentUserId}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

const MessageBubble = ({ message, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${
        isOwn
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}
    >
      <p>{message.content}</p>
      <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
        {isOwn && (
          <span>
            {message.status === 'sent' && '✓'}
            {message.status === 'delivered' && '✓✓'}
            {message.status === 'read' && '✓✓'}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default Messages;
