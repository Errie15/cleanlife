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
  EVENING: 'evening'
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
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule3',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule4',
    day: 'Tuesday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule5',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule6',
    day: 'Wednesday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule7',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule8',
    day: 'Thursday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule9',
    day: 'Friday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule10',
    day: 'Friday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule11',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule12',
    day: 'Saturday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule13',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.MORNING,
    assignedTo: 'user1', // Erik
    createdAt: new Date().toISOString()
  },
  {
    id: 'schedule14',
    day: 'Sunday',
    timeSlot: TIME_SLOTS.EVENING,
    assignedTo: 'user2', // Linnea
    createdAt: new Date().toISOString()
  }
]; 