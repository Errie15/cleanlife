import React from 'react';

// Component to display a single reward
const RewardCard = ({ reward, users, currentUserId, userPoints, onClaim, onDelete }) => {
  const { id, name, pointsCost, claimedBy, claimedAt } = reward;
  
  // Find the user who claimed the reward, if any
  const claimedByUser = claimedBy ? users.find(user => user.id === claimedBy) : null;
  
  // Determine if the current user has enough points to claim this reward
  const hasEnoughPoints = userPoints >= pointsCost;
  
  // Format claim date if the reward has been claimed
  const claimDate = claimedAt ? new Date(claimedAt).toLocaleDateString() : null;
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 ${claimedBy ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
          <div className="my-2">
            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs">
              {pointsCost} poäng
            </span>
          </div>
          
          {claimedByUser && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Belöningen är redan tagen av {claimedByUser.name} ({claimDate})</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          {!claimedBy && (
            <button
              onClick={() => onClaim(id, currentUserId)}
              className={`px-3 py-1 rounded-md text-sm ${
                hasEnoughPoints 
                  ? 'bg-green-500 hover:bg-green-600 text-gray-100' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!hasEnoughPoints}
              title={!hasEnoughPoints ? 'Du har inte tillräckligt med poäng' : ''}
            >
              Ta belöning
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

export default RewardCard; 