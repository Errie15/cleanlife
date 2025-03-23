import React, { useState, useRef, useEffect } from 'react';
import { addMessage } from '../models/messages';

// Chat component for messaging between users
const Chat = ({ messages, users, currentUserId, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

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
  };

  return (
    <div className="bg-gray-50 rounded-md p-3 shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Chatt</h2>
      
      <div className="bg-white rounded-md border border-gray-200 mb-3">
        <div className="h-64 overflow-y-auto p-3 space-y-3">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Inga meddelanden än</p>
          ) : (
            messages.map((msg) => {
              const sender = users.find(user => user.id === msg.sender);
              const isCurrentUser = msg.sender === currentUserId;
              const msgDate = new Date(msg.timestamp).toLocaleTimeString();
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-xs break-words ${
                      isCurrentUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.message}</p>
                    <div className="flex justify-between items-center text-xs opacity-75">
                      <span>{sender ? sender.name : 'Okänd'}</span>
                      <span>{msgDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Skriv ett meddelande..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md text-sm font-medium hover:bg-blue-700"
        >
          Skicka
        </button>
      </form>
    </div>
  );
};

export default Chat; 