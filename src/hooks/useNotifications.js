import { useState, useEffect } from 'react';
import { 
  getNotifications, 
  subscribeToNotifications, 
  addNotification,
  removeNotification,
  notifyChoreCompleted,
  notifyRewardClaimed
} from '../utils/notifications';

// A custom hook for accessing and managing notifications
const useNotifications = () => {
  const [notifications, setNotifications] = useState(getNotifications());

  useEffect(() => {
    // Subscribe to notification changes
    const unsubscribe = subscribeToNotifications(setNotifications);
    
    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  // Return notifications and functions to manipulate them
  return {
    notifications,
    addNotification,
    removeNotification,
    notifyChoreCompleted,
    notifyRewardClaimed
  };
};

export default useNotifications; 