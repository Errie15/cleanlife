import React, { useState, useRef, useEffect } from 'react';
import { addMessage } from '../models/messages';

// Chat component for messaging between users
const Chat = ({ messages, users, currentUserId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Common emoji reactions
  const emojiSet = ['😊', '👍', '❤️', '😂', '🎉', '👏', '🙌'];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setIsAnimating(true);
    onSendMessage(currentUserId, newMessage.trim());
    setNewMessage('');
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    
    // Focus the input after sending
    setTimeout(() => {
      const inputElement = document.getElementById('chat-input');
      if (inputElement) inputElement.focus();
    }, 0);
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmoji(false);
    // Focus back on input
    setTimeout(() => {
      const inputElement = document.getElementById('chat-input');
      if (inputElement) inputElement.focus();
    }, 0);
  };

  // Toggle chat expansion
  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString('sv-SE');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Get user color based on ID (blue for user 1, pink for user 2)
  const getUserColor = (userId) => {
    return userId === users[0]?.id ? 'blue' : 'pink';
  };
  
  // Define color classes based on user
  const getBubbleColors = (userId, isCurrentUser) => {
    const userColor = getUserColor(userId);
    
    if (isCurrentUser) {
      return userColor === 'blue' 
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
        : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white';
    } else {
      return userColor === 'blue'
        ? 'bg-blue-100 text-blue-900 border border-blue-200'
        : 'bg-pink-100 text-pink-900 border border-pink-200';
    }
  };

  return (
    <div className="flex flex-col h-full relative mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-xl font-semibold text-purple-800">Konversation</h2>
        </div>
        <div className="flex items-center">
          <div className="text-sm text-purple-800 mr-3">
            {messages.length} {messages.length === 1 ? 'meddelande' : 'meddelanden'}
          </div>
          <button 
            onClick={toggleChatExpansion}
            className="p-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
            aria-label={isChatExpanded ? "Minimera chat" : "Expandera chat"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isChatExpanded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-t-xl border border-gray-200 overflow-hidden shadow-sm">
        <div 
          ref={chatContainerRef}
          className={`${isChatExpanded ? 'h-96' : 'h-56'} md:h-auto max-h-96 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-50 to-white choresList-scrollbar chat-messages-container transition-all duration-300`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-purple-700 font-medium">Inga meddelanden än</p>
              <p className="text-purple-600 text-sm mt-1">Börja konversationen genom att skicka ett meddelande</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 rounded-full px-3 py-1 shadow-sm">
                    <span className="text-xs text-gray-600 font-medium">{date}</span>
                  </div>
                </div>
                
                {dateMessages.map((msg) => {
                  const sender = users.find(user => user.id === msg.sender);
                  const isCurrentUser = msg.sender === currentUserId;
                  const msgTime = new Date(msg.timestamp).toLocaleTimeString('sv-SE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const bubbleColors = getBubbleColors(msg.sender, isCurrentUser);
                  const userColor = getUserColor(msg.sender);
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                    >
                      {!isCurrentUser && (
                        <div className={`user-avatar user-avatar-${userColor} mr-2 self-end mb-1`}>
                          {sender?.name.charAt(0) || '?'}
                        </div>
                      )}
                      
                      <div 
                        className={`px-4 py-3 max-w-[85%] sm:max-w-xs break-words shadow-sm ${bubbleColors} ${isCurrentUser ? 'chat-bubble-right' : 'chat-bubble-left'}`}
                      >
                        <p className="text-sm mb-2 font-medium">{msg.message}</p>
                        <div className="flex justify-between items-center text-xs opacity-80">
                          <span className="font-medium">{sender ? sender.name : 'Okänd'}</span>
                          <span>{msgTime}</span>
                        </div>
                      </div>
                      
                      {isCurrentUser && (
                        <div className={`user-avatar user-avatar-${userColor} ml-2 self-end mb-1`}>
                          {sender?.name.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex bg-white p-3 rounded-b-xl shadow-md chat-input-container border-t border-purple-100">
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 rounded-full bg-purple-100 text-purple-700 mr-3 hover:bg-purple-200 transition-colors"
          aria-label="Open emoji picker"
        >
          <span role="img" aria-label="Emoji">😊</span>
        </button>
        
        {showEmoji && (
          <div className="absolute bottom-14 left-0 bg-white rounded-lg shadow-lg p-2 border border-gray-200 flex space-x-2 z-10 emoji-picker">
            {emojiSet.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-lg"
                aria-label={`Add ${emoji} emoji`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
        <div className="relative flex-1">
          <input
            id="chat-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-l-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 bg-white text-gray-800 font-medium placeholder:text-gray-500 placeholder:font-normal text-base leading-normal"
            placeholder="Skriv ett meddelande..."
            aria-label="Message input"
          />
          <button
            type="button"
            onClick={() => setNewMessage('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 ${!newMessage ? 'hidden' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-r-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${isAnimating ? 'animate-bounce' : ''} border-2 border-purple-600 shadow-sm`}
          aria-label="Send message"
        >
          <span className="mr-2 hidden sm:inline">Skicka</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${newMessage.trim() ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat; 