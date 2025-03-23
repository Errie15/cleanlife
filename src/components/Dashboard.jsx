import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useNotifications from '../hooks/useNotifications';
import { sampleChores, getAssignedUser, CATEGORY } from '../models/chores';
import { sampleUsers } from '../models/users';
import { sampleRewards, claimReward } from '../models/rewards';
import { sampleMessages, addMessage } from '../models/messages';
import { getUserPoints } from '../models/users';

import Layout from './Layout';
import ChoresList from './ChoresList';
import AddChoreForm from './AddChoreForm';
import RewardsList from './RewardsList';
import AddRewardForm from './AddRewardForm';
import Chat from './Chat';

// Main dashboard component
const Dashboard = () => {
  // State from localStorage
  const [users, setUsers] = useLocalStorage('cleanlife_users', sampleUsers);
  const [chores, setChores] = useLocalStorage('cleanlife_chores', sampleChores);
  const [rewards, setRewards] = useLocalStorage('cleanlife_rewards', sampleRewards);
  const [messages, setMessages] = useLocalStorage('cleanlife_messages', sampleMessages);
  
  // UI state
  const [showAddChoreForm, setShowAddChoreForm] = useState(false);
  const [showAddRewardForm, setShowAddRewardForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(users[0]?.id);
  
  // Notifications
  const { notifyChoreCompleted, notifyRewardClaimed } = useNotifications();
  
  // Calculate which user is responsible for this week's chores
  const weeklyUser = getAssignedUser(users);
  
  // Get current user points
  const userPoints = getUserPoints(currentUserId, users);
  
  // Update assignments based on week
  useEffect(() => {
    const updatedChores = chores.map(chore => {
      if (chore.category === CATEGORY.DAILY && chore.status === 'pending') {
        return { ...chore, assignedTo: weeklyUser.id };
      }
      return chore;
    });
    
    setChores(updatedChores);
  }, [weeklyUser]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Switch between the two users
  const handleSwitchUser = () => {
    const otherUserId = users.find(user => user.id !== currentUserId)?.id;
    if (otherUserId) {
      setCurrentUserId(otherUserId);
    }
  };
  
  // Add a new chore
  const handleAddChore = (newChore) => {
    setChores([...chores, newChore]);
    setShowAddChoreForm(false);
  };
  
  // Mark a chore as completed
  const handleCompleteChore = (choreId) => {
    const updatedChores = chores.map(chore => {
      if (chore.id === choreId) {
        // If it's a major task, add points to the current user
        if (chore.category === CATEGORY.MAJOR && chore.points) {
          const updatedUsers = users.map(user => {
            if (user.id === currentUserId) {
              return { ...user, points: user.points + chore.points };
            }
            return user;
          });
          setUsers(updatedUsers);
        }
        
        const completedChore = { 
          ...chore, 
          status: 'completed', 
          completedBy: currentUserId,
          completedAt: new Date().toISOString() 
        };
        
        // Notify
        const currentUser = users.find(user => user.id === currentUserId);
        notifyChoreCompleted(completedChore.title, currentUser?.name || 'Användaren');
        
        return completedChore;
      }
      return chore;
    });
    
    setChores(updatedChores);
  };
  
  // Delete a chore
  const handleDeleteChore = (choreId) => {
    setChores(chores.filter(chore => chore.id !== choreId));
  };
  
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
  
  // Send a chat message
  const handleSendMessage = (senderId, message) => {
    const updatedMessages = addMessage(senderId, message, messages);
    setMessages(updatedMessages);
  };
  
  // Filter chores by status and type
  const pendingChores = chores.filter(chore => chore.status === 'pending' && chore.category === CATEGORY.DAILY);
  const completedChores = chores.filter(chore => chore.status === 'completed');
  const majorChores = chores.filter(chore => chore.category === CATEGORY.MAJOR && chore.status === 'pending');
  
  // Get current user
  const currentUser = users.find(user => user.id === currentUserId);
  
  return (
    <Layout>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Hej, {currentUser?.name || 'Användare'}
          </h2>
          <p className="text-sm text-gray-600">
            Det är {weeklyUser.id === currentUserId ? 'din' : weeklyUser.name + 's'} vecka
          </p>
        </div>
        
        <button
          onClick={handleSwitchUser}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-medium"
        >
          Byt användare
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly chores column */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Veckans sysslor</h3>
            <button
              onClick={() => setShowAddChoreForm(!showAddChoreForm)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              {showAddChoreForm ? 'Avbryt' : 'Lägg till'}
            </button>
          </div>
          
          {showAddChoreForm ? (
            <AddChoreForm 
              onAddChore={handleAddChore} 
              onCancel={() => setShowAddChoreForm(false)} 
            />
          ) : (
            <ChoresList
              title="Pågående"
              chores={pendingChores}
              users={users}
              onComplete={handleCompleteChore}
              onDelete={handleDeleteChore}
            />
          )}
        </div>
        
        {/* Completed chores column */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Klara sysslor</h3>
          <ChoresList
            title="Färdiga"
            chores={completedChores}
            users={users}
            onComplete={handleCompleteChore}
            onDelete={handleDeleteChore}
          />
        </div>
        
        {/* Rewards column */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Belöningar & Större uppgifter</h3>
            <button
              onClick={() => setShowAddRewardForm(!showAddRewardForm)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
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
            <>
              <ChoresList
                title="Större uppgifter"
                chores={majorChores}
                users={users}
                onComplete={handleCompleteChore}
                onDelete={handleDeleteChore}
              />
              
              <div className="mt-4">
                <RewardsList
                  rewards={rewards}
                  users={users}
                  currentUserId={currentUserId}
                  userPoints={userPoints}
                  onClaim={handleClaimReward}
                  onDelete={handleDeleteReward}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Chat section */}
      <div className="mt-6">
        <Chat
          messages={messages}
          users={users}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </Layout>
  );
};

export default Dashboard; 