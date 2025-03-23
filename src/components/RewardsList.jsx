import React from 'react';
import RewardCard from './RewardCard';

// Component to display a list of rewards
const RewardsList = ({ rewards, users, currentUserId, userPoints, onClaim, onDelete }) => {
  // Sort rewards: available first, then by point cost
  const sortedRewards = [...rewards].sort((a, b) => {
    // First prioritize unclaimed rewards
    if (a.claimedBy && !b.claimedBy) return 1;
    if (!a.claimedBy && b.claimedBy) return -1;
    
    // Then sort by point cost (lowest first)
    return a.pointsCost - b.pointsCost;
  });

  return (
    <div className="bg-gray-50 rounded-md p-3 shadow">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Belöningar</h2>
      
      <div className="mb-3 bg-yellow-100 p-2 rounded-md border border-yellow-300">
        <p className="text-sm text-yellow-900 font-medium">Dina poäng: {userPoints}</p>
      </div>
      
      <div className="space-y-2">
        {sortedRewards.length === 0 ? (
          <p className="text-gray-700 text-sm p-2">Inga belöningar att visa</p>
        ) : (
          sortedRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              users={users}
              currentUserId={currentUserId}
              userPoints={userPoints}
              onClaim={onClaim}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RewardsList; 