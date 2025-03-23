import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import { sampleRewards, claimReward } from '../models/rewards';
import { sampleUsers } from '../models/users';
import useNotifications from '../hooks/useNotifications';
import Layout from './Layout';
import AddRewardForm from './AddRewardForm';

// Component to display rewards in three columns format
const Rewards = () => {
  // State från API
  const [rewards, setRewards, rewardsLoading, rewardsError] = useApi('/api/rewards', sampleRewards);
  const [users, setUsers, usersLoading, usersError] = useApi('/api/users', sampleUsers);
  const [showAddRewardForm, setShowAddRewardForm] = useState(false);
  
  // Notifications
  const { notifyRewardClaimed } = useNotifications();
  
  // Användardetaljer - sätts när data har laddats
  const [erik, setErik] = useState(null);
  const [linnea, setLinnea] = useState(null);
  
  // Uppdatera användarreferenser när data har laddats
  useEffect(() => {
    if (!usersLoading && users && users.length > 0) {
      setErik(users.find(user => user.id === 'user1'));
      setLinnea(users.find(user => user.id === 'user2'));
    }
  }, [users, usersLoading]);
  
  // Kontrollera om data fortfarande laddas
  const isLoading = usersLoading || rewardsLoading;
  const hasError = usersError || rewardsError;

  // Om data fortfarande laddas, visa en laddningsindikator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-primary">Laddar...</div>
      </div>
    );
  }
  
  // Om det finns fel, visa felmeddelande
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-red-500">
          Ett fel uppstod vid laddning av data.<br/>
          <button 
            className="mt-4 bg-primary text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }
  
  // Add a new reward
  const handleAddReward = (newReward) => {
    setRewards([...rewards, newReward]);
    setShowAddRewardForm(false);
  };
  
  // Claim a reward
  const handleClaimReward = (rewardId, userId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    // Check if user has enough points
    const user = users.find(u => u.id === userId);
    if (!user || user.points < reward.pointsCost) return;
    
    // Deduct points
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, points: u.points - reward.pointsCost };
      }
      return u;
    });
    
    // Mark reward as claimed
    const updatedRewards = claimReward(rewardId, userId, rewards);
    
    // Notify
    notifyRewardClaimed(reward.name, user.name);
    
    setUsers(updatedUsers);
    setRewards(updatedRewards);
  };
  
  // Delete a reward
  const handleDeleteReward = (rewardId) => {
    setRewards(rewards.filter(reward => reward.id !== rewardId));
  };
  
  // Separate rewards by claimed status and user
  const erikRewards = rewards.filter(reward => reward.claimedBy === 'user1');
  const linneaRewards = rewards.filter(reward => reward.claimedBy === 'user2');
  const availableRewards = rewards.filter(reward => !reward.claimedBy);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">Belöningar</h1>
          <button
            onClick={() => setShowAddRewardForm(!showAddRewardForm)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {showAddRewardForm ? 'Avbryt' : 'Lägg till belöning'}
          </button>
        </div>
        
        {showAddRewardForm ? (
          <AddRewardForm
            onAddReward={handleAddReward}
            onCancel={() => setShowAddRewardForm(false)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Erik's Column */}
            <div className="bg-blue-50 rounded-xl p-4 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: erik?.color || '#3b82f6' }}
                >
                  {erik?.name.charAt(0) || 'E'}
                </div>
                <h2 className="text-xl font-semibold">{erik?.name || 'Erik'}</h2>
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                  <span className="text-sm font-medium text-blue-800">{erik?.points || 0} poäng</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {erikRewards.length === 0 ? (
                  <p className="text-gray-600 text-sm">Inga belöningar valda</p>
                ) : (
                  erikRewards.map(reward => (
                    <div key={reward.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{reward.name}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(reward.claimedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {reward.pointsCost} poäng
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Middle Column - Available Rewards */}
            <div className="bg-purple-50 rounded-xl p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">Tillgängliga Belöningar</h2>
              
              <div className="space-y-3">
                {availableRewards.length === 0 ? (
                  <p className="text-gray-600 text-sm">Inga tillgängliga belöningar</p>
                ) : (
                  availableRewards.map(reward => (
                    <div key={reward.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">{reward.name}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {reward.pointsCost} poäng
                        </span>
                      </div>
                      
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => handleClaimReward(reward.id, 'user1')}
                          className={`px-2 py-1 text-xs rounded-md ${
                            erik?.points >= reward.pointsCost
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={erik?.points < reward.pointsCost}
                        >
                          {erik?.name} väljer
                        </button>
                        
                        <button
                          onClick={() => handleClaimReward(reward.id, 'user2')}
                          className={`px-2 py-1 text-xs rounded-md ${
                            linnea?.points >= reward.pointsCost
                              ? 'bg-pink-500 hover:bg-pink-600 text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={linnea?.points < reward.pointsCost}
                        >
                          {linnea?.name} väljer
                        </button>
                        
                        <button
                          onClick={() => handleDeleteReward(reward.id)}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-xs"
                        >
                          Ta bort
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Linnea's Column */}
            <div className="bg-pink-50 rounded-xl p-4 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: linnea?.color || '#ec4899' }}
                >
                  {linnea?.name.charAt(0) || 'L'}
                </div>
                <h2 className="text-xl font-semibold">{linnea?.name || 'Linnea'}</h2>
                <div className="px-3 py-1 bg-pink-100 rounded-full">
                  <span className="text-sm font-medium text-pink-800">{linnea?.points || 0} poäng</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {linneaRewards.length === 0 ? (
                  <p className="text-gray-600 text-sm">Inga belöningar valda</p>
                ) : (
                  linneaRewards.map(reward => (
                    <div key={reward.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{reward.name}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(reward.claimedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {reward.pointsCost} poäng
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Rewards; 