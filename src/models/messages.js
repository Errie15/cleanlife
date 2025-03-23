// Messages data model
export const sampleMessages = [];

// Add a new message
export const addMessage = (sender, message, messages) => {
  const newMessage = {
    id: `msg${Date.now()}`,
    sender,
    message,
    timestamp: new Date().toISOString()
  };
  
  return [...messages, newMessage];
}; 