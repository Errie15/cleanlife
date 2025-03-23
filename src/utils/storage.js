// Storage utilities for localStorage
const STORAGE_KEYS = {
  USERS: 'cleanlife_users',
  CHORES: 'cleanlife_chores',
  REWARDS: 'cleanlife_rewards',
  MESSAGES: 'cleanlife_messages'
};

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
};

// Get data from localStorage
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting from localStorage: ${error}`);
    return defaultValue;
  }
};

// Save users to localStorage
export const saveUsers = (users) => saveToStorage(STORAGE_KEYS.USERS, users);

// Get users from localStorage
export const getUsers = (defaultValue = []) => getFromStorage(STORAGE_KEYS.USERS, defaultValue);

// Save chores to localStorage
export const saveChores = (chores) => saveToStorage(STORAGE_KEYS.CHORES, chores);

// Get chores from localStorage
export const getChores = (defaultValue = []) => getFromStorage(STORAGE_KEYS.CHORES, defaultValue);

// Save rewards to localStorage
export const saveRewards = (rewards) => saveToStorage(STORAGE_KEYS.REWARDS, rewards);

// Get rewards from localStorage
export const getRewards = (defaultValue = []) => getFromStorage(STORAGE_KEYS.REWARDS, defaultValue);

// Save messages to localStorage
export const saveMessages = (messages) => saveToStorage(STORAGE_KEYS.MESSAGES, messages);

// Get messages from localStorage
export const getMessages = (defaultValue = []) => getFromStorage(STORAGE_KEYS.MESSAGES, defaultValue);

// Clear all app data
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}; 