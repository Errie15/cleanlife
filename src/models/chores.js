// Chore data model
export const FREQUENCY = {
  ONCE: 'once',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  DAILY: 'daily'
};

export const CATEGORY = {
  DAILY: 'daily',
  MAJOR: 'major',
  MAT: 'mat',
  STAD: 'stad',
  TVATT: 'tvatt',
  SICKAN: 'sickan'
};

// Generate a unique ID for new chores
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Sample chores for initial data
export const sampleChores = [
  // Mat kategori
  {
    id: 'chore1',
    title: 'Handla + laga mat',
    description: 'Mån-tor',
    category: CATEGORY.MAT,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore2',
    title: 'Frukost',
    description: 'Mån-sön',
    category: CATEGORY.MAT,
    frequency: FREQUENCY.DAILY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore3',
    title: 'Städa köket',
    category: CATEGORY.MAT,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore4',
    title: 'Panta',
    category: CATEGORY.MAT,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  
  // Städ kategori
  {
    id: 'chore5',
    title: 'Allmänt plock',
    description: 'Mån-sön',
    category: CATEGORY.STAD,
    frequency: FREQUENCY.DAILY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore6',
    title: 'Städning',
    description: 'Badrum, dammsug, våttork av ytor, moppa',
    category: CATEGORY.STAD,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore7',
    title: 'Återvinning',
    category: CATEGORY.STAD,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  
  // Tvätt kategori
  {
    id: 'chore8',
    title: 'Tvätta och hänga',
    description: 'Lakan, handdukar, kökshanddukar',
    category: CATEGORY.TVATT,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: null,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  
  // Sickan morgon kategori
  {
    id: 'chore9',
    title: 'Sickan morgon (Mån, Ons)',
    category: CATEGORY.SICKAN,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: 'user1', // Erik
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'chore10',
    title: 'Sickan morgon (Tis, Tor, Fre)',
    category: CATEGORY.SICKAN,
    frequency: FREQUENCY.WEEKLY,
    assignedTo: 'user2', // Linnea
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// Determine whose week it is based on the current week number
export const getAssignedUser = (users) => {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return users[weekNumber % users.length];
}; 