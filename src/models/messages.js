// Messages data model
export const sampleMessages = [
  {
    id: 'msg1',
    sender: 'user1',
    message: 'Hej! Kan du ta hand om dammsugningen idag?',
    timestamp: new Date().toISOString()
  },
  {
    id: 'msg2',
    sender: 'user2',
    message: 'Visst, jag fixar det!',
    timestamp: new Date(Date.now() + 1000 * 60).toISOString() // 1 minute later
  }
];

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