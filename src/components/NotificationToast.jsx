import React from 'react';
import useNotifications from '../hooks/useNotifications';

// Notification toast component to display in-app notifications
const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-md p-4 shadow-lg ${
            notification.type === 'success' ? 'bg-green-50' : 
            notification.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 
                notification.type === 'error' ? 'text-red-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                className="inline-flex text-gray-400 hover:text-gray-500"
                onClick={() => removeNotification(notification.id)}
              >
                <span className="sr-only">Stäng</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 