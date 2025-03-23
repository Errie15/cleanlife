import React from 'react';
import { CATEGORY, FREQUENCY } from '../models/chores';

// Component to display a single chore
const ChoreCard = ({ chore, users, onComplete, onDelete }) => {
  const { id, title, category, frequency, status, assignedTo, points, completedAt } = chore;
  
  // Find the assigned user object
  const assignedUser = users.find(user => user.id === assignedTo);
  
  // Determine if it's a major task (worth points)
  const isMajorTask = category === CATEGORY.MAJOR;
  
  // Determine if it's completed
  const isCompleted = status === 'completed';
  
  // Format the completion date if it exists
  const formattedDate = completedAt ? new Date(completedAt).toLocaleDateString('sv-SE') : '';
  
  return (
    <div 
      className={`bg-white rounded-lg border ${isCompleted ? 'border-green-200' : 'border-gray-200'} 
      transition-all duration-200 ${isCompleted ? 'opacity-80' : 'hover:shadow-md hover-lift'}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-lg text-gray-800">{title}</h3>
            <div className="flex flex-wrap gap-2 my-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                category === CATEGORY.DAILY 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-secondary-100 text-secondary-800'
              }`}>
                {category === CATEGORY.DAILY ? 'Vardaglig' : 'Större uppgift'}
              </span>
              
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                {frequency === FREQUENCY.ONCE ? 'Engångs' : 
                  frequency === FREQUENCY.WEEKLY ? 'Varje vecka' :
                  frequency === FREQUENCY.BIWEEKLY ? 'Varannan vecka' : 'Månadsvis'}
              </span>
              
              {isMajorTask && points && (
                <span className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {points} poäng
                </span>
              )}
            </div>
            
            {isCompleted && formattedDate && (
              <div className="text-xs text-gray-500 mt-1">
                Slutfört: {formattedDate}
              </div>
            )}
            
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
                className="p-2 bg-green-500 hover:bg-green-600 text-gray-100 rounded-lg text-sm transition-colors flex items-center justify-center"
                title="Markera som klar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            
            <button
              onClick={() => onDelete(id)}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors flex items-center justify-center"
              title="Ta bort"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isCompleted && (
        <div className="bg-green-50 p-2 rounded-b-lg border-t border-green-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-green-800">Slutfört</span>
        </div>
      )}
    </div>
  );
};

export default ChoreCard; 