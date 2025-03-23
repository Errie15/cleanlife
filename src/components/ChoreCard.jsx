import React from 'react';
import { CATEGORY, FREQUENCY } from '../models/chores';

// Component to display a single chore
const ChoreCard = ({ chore, users, onComplete, onDelete }) => {
  const { id, title, description, category, frequency, status, assignedTo, points, completedAt } = chore;
  
  // Find the assigned user object
  const assignedUser = users.find(user => user.id === assignedTo);
  
  // Determine if it's a major task (worth points)
  const isMajorTask = category === CATEGORY.MAJOR;
  
  // Determine if it's completed
  const isCompleted = status === 'completed';
  
  // Format the completion date if it exists
  const formattedDate = completedAt ? new Date(completedAt).toLocaleDateString('sv-SE') : '';

  // Get user color based on ID (blue for user 1, pink for user 2)
  const getUserColor = (userId) => {
    return userId === users[0].id ? 'blue' : 'pink';
  };

  const userColor = getUserColor(assignedTo);
  const userColorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200'
  };
  
  // Get category label and color
  const getCategoryInfo = (cat) => {
    switch(cat) {
      case CATEGORY.MAT:
        return { label: 'Mat', colorClass: 'bg-amber-100 text-amber-800' };
      case CATEGORY.STAD:
        return { label: 'Städ', colorClass: 'bg-blue-100 text-blue-800' };
      case CATEGORY.TVATT:
        return { label: 'Tvätt', colorClass: 'bg-indigo-100 text-indigo-800' };
      case CATEGORY.SICKAN:
        return { label: 'Sickan', colorClass: 'bg-pink-100 text-pink-800' };
      case CATEGORY.DAILY:
        return { label: 'Vardaglig', colorClass: 'bg-indigo-100 text-indigo-800' };
      case CATEGORY.MAJOR:
        return { label: 'Större uppgift', colorClass: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Övrig', colorClass: 'bg-gray-100 text-gray-800' };
    }
  };
  
  const categoryInfo = getCategoryInfo(category);
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md 
      ${isCompleted ? 'border-l-4 border-l-green-400 border-t border-r border-b border-gray-200' : 
      `border-l-4 ${userColor === 'blue' ? 'border-l-blue-400' : 'border-l-pink-400'} border-t border-r border-b border-gray-200`}
      transition-all duration-200 ${isCompleted ? 'opacity-80' : 'hover-lift'}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-lg text-gray-800">{title}</h3>
            
            {description && (
              <p className="text-sm text-gray-700 mt-1">{description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 my-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${categoryInfo.colorClass}`}>
                {categoryInfo.label}
              </span>
              
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                {frequency === FREQUENCY.ONCE ? 'Engångs' : 
                  frequency === FREQUENCY.DAILY ? 'Dagligen' :
                  frequency === FREQUENCY.WEEKLY ? 'Varje vecka' :
                  frequency === FREQUENCY.BIWEEKLY ? 'Varannan vecka' : 'Månadsvis'}
              </span>
              
              {isMajorTask && points && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {points} poäng
                </span>
              )}
            </div>
            
            {isCompleted && formattedDate && (
              <div className="text-xs text-gray-700 mt-1">
                Slutfört: {formattedDate}
              </div>
            )}
            
            {assignedUser && (
              <div className="flex items-center mt-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${userColorClasses[userColor]}`}
                  title={`Tilldelad till ${assignedUser.name}`}
                >
                  {assignedUser.name.charAt(0)}
                </div>
                <span className="text-xs text-gray-700 ml-2">{assignedUser.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            {!isCompleted && (
              <button
                onClick={() => onComplete(id)}
                className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                title="Markera som slutförd"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
            
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              title="Ta bort"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoreCard; 