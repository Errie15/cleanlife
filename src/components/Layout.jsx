import React from 'react';
import NotificationToast from './NotificationToast';

// Layout component for the entire application
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">CleanLife</h1>
          <p className="text-sm text-gray-500">Hushållssysslor</p>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Notification container */}
      <NotificationToast />
    </div>
  );
};

export default Layout; 