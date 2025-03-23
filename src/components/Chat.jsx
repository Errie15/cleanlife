import React, { useState, useRef, useEffect } from 'react';
import { addMessage } from '../models/messages';

// Chat component for messaging between users
const Chat = ({ messages, users, currentUserId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
    
    onSendMessage(currentUserId, newMessage.trim());
    setNewMessage('');
    
    // Focus the input after sending
    setTimeout(() => {
      const inputElement = document.getElementById('chat-input');
      if (inputElement) inputElement.focus();
    }, 0);
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

  return (
    <div>
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Chatt</h2>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
        <div 
          ref={chatContainerRef}
          className="h-72 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-gray-50 to-white"
          style={{ scrollbarWidth: 'thin' }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 font-medium">Inga meddelanden än</p>
              <p className="text-gray-400 text-sm mt-1">Börja konversationen genom att skicka ett meddelande</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 rounded-full px-3 py-1">
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
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-2xl px-4 py-2 max-w-xs break-words shadow-sm ${
                          isCurrentUser 
                            ? 'bg-primary-600 text-gray-100' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm mb-1">{msg.message}</p>
                        <div className={`flex justify-between items-center text-xs ${
                          isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          <span className="font-medium">{sender ? sender.name : 'Okänd'}</span>
                          <span>{msgTime}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-1">
          <input
            id="chat-input"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-l-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
            placeholder="Skriv ett meddelande..."
          />
          <button
            type="button"
            onClick={() => setNewMessage('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${!newMessage ? 'hidden' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-5 py-3 bg-primary-600 text-gray-100 rounded-r-xl font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span className="mr-2">Skicka</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat; 