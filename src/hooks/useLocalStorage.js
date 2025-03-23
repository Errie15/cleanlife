import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

// A custom hook for using localStorage with React state
const useLocalStorage = (key, initialValue) => {
  // Get from localStorage then parse stored json or return initialValue
  const readValue = () => {
    return getFromStorage(key, initialValue);
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    // Allow value to be a function so we have the same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    
    // Save state
    setStoredValue(valueToStore);
    
    // Save to localStorage
    saveToStorage(key, valueToStore);
  };

  // Listen for changes to the stored value in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage; 