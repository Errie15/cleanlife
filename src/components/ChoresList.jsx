import React from 'react';
import ChoreCard from './ChoreCard';

// Component to display a list of chores in a column
const ChoresList = ({ title, chores, users, onComplete, onDelete }) => {
  return (
    <div className="rounded-lg p-4 bg-gray-50 border border-gray-200">
      <h2 className="text-base font-medium text-gray-700 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {title}
      </h2>
      <div className="space-y-3">
        {chores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-center font-medium">Inga sysslor att visa</p>
            <p className="text-gray-400 text-sm text-center mt-1">Lägg till en ny uppgift för att komma igång</p>
          </div>
        ) : (
          chores.map((chore) => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              users={users}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChoresList; 