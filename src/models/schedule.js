// Schedule data model for pet care
import { generateId } from './chores';

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const TIME_SLOTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night'
};

// Generate a new schedule entry
export const createScheduleEntry = (day, timeSlot, userId) => {
  return {
    id: generateId(),
    day,
    timeSlot,
    assignedTo: userId,
    createdAt: new Date().toISOString()
  };
};

// Get initial schedule with alternating assignments
export const generateInitialSchedule = (users) => {
  if (!users || users.length === 0) return [];
  
  const schedule = [];
  
  DAYS_OF_WEEK.forEach((day, dayIndex) => {
    Object.values(TIME_SLOTS).forEach((timeSlot, slotIndex) => {
      // Alternate users based on day and time slot
      const userIndex = (dayIndex + slotIndex) % users.length;
      schedule.push(createScheduleEntry(day, timeSlot, users[userIndex].id));
    });
  });
  
  return schedule;
};

// Sample schedule data for initial setup
export const sampleSchedule = [
  // Monday
  {
    id: 'schedule1',
    day: 'Monday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule2',
    day: 'Monday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule3',
    day: 'Monday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule4',
    day: 'Monday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  // Tuesday
  {
    id: 'schedule5',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule6',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule7',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule8',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  // Wednesday
  {
    id: 'schedule9',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule10',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule11',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule12',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  // Thursday
  {
    id: 'schedule13',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule14',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule15',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule16',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  // Friday
  {
    id: 'schedule17',
    day: 'Friday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule18',
    day: 'Friday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule19',
    day: 'Friday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule20',
    day: 'Friday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  // Saturday
  {
    id: 'schedule21',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik (was Linnea)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule22',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user2', // Linnea (was Erik)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule23',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik (was Linnea)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule24',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user2', // Linnea (was Erik)
    createdAt: new Date().toISOString()
  },
  // Sunday
  {
    id: 'schedule25',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea (was Erik)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule26',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.AFTERNOON,
    assignedTo: 'user1', // Erik (was Linnea)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule27',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea (was Erik)
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule28',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.NIGHT,
    assignedTo: 'user1', // Erik (was Linnea)
    createdAt: new Date().toISOString()
  }
]; 