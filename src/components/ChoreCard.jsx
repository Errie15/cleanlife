import React from 'react';
import { CATEGORY, FREQUENCY } from '../models/chores';

// Component to display a single chore
const ChoreCard = ({ chore, users, onComplete, onDelete }) => {
  const { id, title, category, frequency, status, assignedTo, points } = chore;
  
  // Find the assigned user object
  const assignedUser = users.find(user => user.id === assignedTo);
  
  // Determine if it's a major task (worth points)
  const isMajorTask = category === CATEGORY.MAJOR;
  
  // Determine if it's completed
  const isCompleted = status === 'completed';
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 ${isCompleted ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex flex-wrap gap-2 my-2">
            <span className={`px-2 py-1 rounded text-xs ${
              category === CATEGORY.DAILY ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {category === CATEGORY.DAILY ? 'Vardaglig' : 'Större uppgift'}
            </span>
            
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">
              {frequency === FREQUENCY.ONCE ? 'Engångs' : 
                frequency === FREQUENCY.WEEKLY ? 'Varje vecka' :
                frequency === FREQUENCY.BIWEEKLY ? 'Varannan vecka' : 'Månadsvis'}
            </span>
            
            {isMajorTask && (
              <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
                {points} poäng
              </span>
            )}
          </div>
          
          {assignedUser && (
            <div className="flex items-center mt-2">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: assignedUser.color }}
              ></div>
              <span className="text-sm text-gray-600">{assignedUser.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {!isCompleted && (
            <button
              onClick={() => onComplete(id)}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
            >
              Klar
            </button>
          )}
          
          <button
            onClick={() => onDelete(id)}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoreCard; 