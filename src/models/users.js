// User data model
export const sampleUsers = [
  {
    id: 'user1',
    name: 'Erik',
    color: '#4299e1', // blue color
    points: 0
  },
  {
    id: 'user2',
    name: 'Linnea',
    color: '#f56565', // red color
    points: 0
  }
];

// Get current points for a user
export const getUserPoints = (userId, users) => {
  const user = users.find(user => user.id === userId);
  return user ? user.points : 0;
}; 