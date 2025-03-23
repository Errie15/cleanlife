// Simple notification system
let notifications = [];
let listeners = [];

// Add a notification
export const addNotification = (message, type = 'info', duration = 3000) => {
  const id = Date.now().toString();
  const notification = { id, message, type, duration };
  
  notifications = [...notifications, notification];
  notifyListeners();
  
  // Auto-remove after duration
  setTimeout(() => {
    removeNotification(id);
  }, duration);
  
  return id;
};

// Remove a notification
export const removeNotification = (id) => {
  notifications = notifications.filter(n => n.id !== id);
  notifyListeners();
};

// Get all current notifications
export const getNotifications = () => {
  return [...notifications];
};

// Subscribe to notification changes
export const subscribeToNotifications = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(cb => cb !== callback);
  };
};

// Notify all listeners of changes
const notifyListeners = () => {
  listeners.forEach(callback => callback(getNotifications()));
};

// Create a notification for a completed chore
export const notifyChoreCompleted = (choreName, userName) => {
  return addNotification(`${userName} har gjort klart ${choreName}`, 'success', 5000);
};

// Create a notification for a claimed reward
export const notifyRewardClaimed = (rewardName, userName) => {
  return addNotification(`${userName} har belönat sig med ${rewardName}`, 'success', 5000);
}; 