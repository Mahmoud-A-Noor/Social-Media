import { useState, useEffect } from 'react';
import notify from '../../utils/notify';
import socketService from '../../config/socket';

const ChatInput = ({ chatId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.emit('typing', { chatId });
    }
    
    clearTimeout(typingTimeout);
    
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socketService.emit('stop-typing', { chatId });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await onSendMessage(chatId, message.trim());
      setMessage('');
      setIsTyping(false);
      socketService.emit('stop-typing', { chatId });
    } catch (error) {
      notify('Failed to send message', 'error');
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
      if (isTyping) {
        socketService.emit('stop-typing', { chatId });
      }
    };
  }, [chatId]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
