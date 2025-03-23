// Chore data model
export const FREQUENCY = {
  ONCE: 'once',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly'
};

export const CATEGORY = {
  DAILY: 'daily',
  MAJOR: 'major'
};

// Generate a unique ID for new chores
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sample chores for initial data
export const sampleChores = [
  {
    id: 'chore1',
    title: 'Dammsuga',
    category: CATEGORY.DAILY,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null, // Will be calculated based on the week
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore2',
    title: 'Diska',
    category: CATEGORY.DAILY,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore3',
    title: 'Måla om i köket',
    category: CATEGORY.MAJOR,
    frequency: FREQUENCY.ONCE,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    points: 15
  }
];

// Determine whose week it is based on the current week number
export const getAssignedUser = (users) => {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return users[weekNumber % users.length];
}; 