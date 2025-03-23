import React from 'react';
import ChoreCard from './ChoreCard';

// Component to display a list of chores in a column
const ChoresList = ({ title, chores, users, onComplete, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-md p-3 shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>
      <div className="space-y-2">
        {chores.length === 0 ? (
          <p className="text-gray-500 text-sm p-2">Inga sysslor att visa</p>
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