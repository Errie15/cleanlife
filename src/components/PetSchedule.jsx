import React, { useState } from 'react';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../models/schedule';

// Component for displaying and managing pet care schedule
const PetSchedule = ({ schedule, users, currentUserId, onUpdateSchedule, showFullSchedule = true }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Get user by ID
  const getUserById = (userId) => {
    return users.find(user => user.id === userId);
  };

  // Get color based on user ID
  const getUserColor = (userId) => {
    const user = getUserById(userId);
    return user ? user.color : '#cbd5e0';
  };

  // Get user name based on user ID
  const getUserName = (userId) => {
    const user = getUserById(userId);
    return user ? user.name : 'Unassigned';
  };

  // Handle clicking on a schedule slot
  const handleSlotClick = (day, timeSlot) => {
    if (!editMode) return;
    
    setSelectedDay(day);
    setSelectedSlot(timeSlot);
  };

  // Handle assigning a user to a slot
  const handleAssignUser = (userId) => {
    if (!selectedDay || !selectedSlot) return;
    
    // Find the schedule entry to update
    const updatedSchedule = schedule.map(entry => {
      if (entry.day === selectedDay && entry.timeSlot === selectedSlot) {
        return { ...entry, assignedTo: userId };
      }
      return entry;
    });
    
    // Call the update function passed from parent
    onUpdateSchedule(updatedSchedule);
    
    // Reset selection
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  // Get schedule entry for a specific day and time slot
  const getScheduleEntry = (day, timeSlot) => {
    return schedule.find(entry => entry.day === day && entry.timeSlot === timeSlot);
  };

  // Get today's schedule entries
  const getTodayEntries = () => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    return schedule.filter(entry => entry.day === today);
  };

  // Format time slot for display
  const formatTimeSlot = (timeSlot) => {
    const timeMap = {
      [TIME_SLOTS.MORNING]: 'Morning (6-12)',
      [TIME_SLOTS.AFTERNOON]: 'Afternoon (12-17)',
      [TIME_SLOTS.EVENING]: 'Evening (17-21)',
      [TIME_SLOTS.NIGHT]: 'Night (21-6)'
    };
    return timeMap[timeSlot] || timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1);
  };

  // Today's assigned entries
  const todayEntries = getTodayEntries();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sickan's Daily Schedule
        </h2>
        {showFullSchedule && (
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              editMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {editMode ? 'Done Editing' : 'Edit Schedule'}
          </button>
        )}
      </div>

      {/* Today's schedule - for quick reference */}
      <div className="px-6 py-4 bg-purple-50">
        <h3 className="text-md font-medium text-purple-800 mb-3">Today's Walks & Care</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {todayEntries.map(entry => (
            <div 
              key={entry.id}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            >
              <div className="text-sm font-medium text-gray-500">{formatTimeSlot(entry.timeSlot)}</div>
              <div className="mt-1 flex items-center">
                <div 
                  className="h-4 w-4 rounded-full mr-2"
                  style={{ backgroundColor: getUserColor(entry.assignedTo) }}
                ></div>
                <div className="font-medium">{getUserName(entry.assignedTo)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly schedule grid - only show when showFullSchedule is true */}
      {showFullSchedule && (
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  {DAYS_OF_WEEK.map(day => (
                    <th key={day} className="px-3 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {day.substring(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(TIME_SLOTS).map(([slotKey, timeSlot]) => (
                  <tr key={timeSlot}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                      {formatTimeSlot(timeSlot)}
                    </td>
                    {DAYS_OF_WEEK.map(day => {
                      const entry = getScheduleEntry(day, timeSlot);
                      const assignedUserId = entry ? entry.assignedTo : null;
                      const isSelected = selectedDay === day && selectedSlot === timeSlot;
                      
                      return (
                        <td
                          key={`${day}-${timeSlot}`}
                          onClick={() => handleSlotClick(day, timeSlot)}
                          className={`px-3 py-4 whitespace-nowrap text-sm text-center cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-100' : ''
                          } ${editMode ? 'hover:bg-purple-50' : ''}`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div 
                              className="h-5 w-5 rounded-full mb-1"
                              style={{ backgroundColor: getUserColor(assignedUserId) }}
                            ></div>
                            <span className="font-medium">
                              {getUserName(assignedUserId)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User selection panel (visible in edit mode when a slot is selected) */}
      {showFullSchedule && editMode && selectedDay && selectedSlot && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Assign for {selectedDay}, {formatTimeSlot(selectedSlot)}:
          </h3>
          <div className="flex space-x-2">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleAssignUser(user.id)}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-200 flex items-center"
              >
                <div 
                  className="h-4 w-4 rounded-full mr-2"
                  style={{ backgroundColor: user.color }}
                ></div>
                {user.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSchedule; 