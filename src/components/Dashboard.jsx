import React, { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useNotifications from '../hooks/useNotifications';
import { sampleChores, getAssignedUser, CATEGORY } from '../models/chores';
import { sampleUsers } from '../models/users';
import { sampleRewards, claimReward } from '../models/rewards';
import { sampleMessages, addMessage } from '../models/messages';
import { sampleSchedule } from '../models/schedule';
import { getUserPoints } from '../models/users';

import Layout from './Layout';
import ChoresList from './ChoresList';
import AddChoreForm from './AddChoreForm';
import RewardsList from './RewardsList';
import AddRewardForm from './AddRewardForm';
import Chat from './Chat';
import PetSchedule from './PetSchedule';

// Main dashboard component
const Dashboard = () => {
  // State from localStorage
  const [users, setUsers] = useLocalStorage('cleanlife_users', sampleUsers);
  const [chores, setChores] = useLocalStorage('cleanlife_chores', sampleChores);
  const [rewards, setRewards] = useLocalStorage('cleanlife_rewards', sampleRewards);
  const [messages, setMessages] = useLocalStorage('cleanlife_messages', sampleMessages);
  const [schedule, setSchedule] = useLocalStorage('cleanlife_schedule', sampleSchedule);
  
  // UI state
  const [showAddChoreForm, setShowAddChoreForm] = useState(false);
  const [showAddRewardForm, setShowAddRewardForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(users[0]?.id);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Notifications
  const { notifyChoreCompleted, notifyRewardClaimed } = useNotifications();
  
  // Calculate which user is responsible for this week's chores
  const weeklyUser = getAssignedUser(users);
  
  // Get current user points
  const userPoints = getUserPoints(currentUserId, users);
  
  // Update pet schedule
  const handleUpdateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };
  
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
  
  // Filter chores based on activeCategory
  const filteredChores = useMemo(() => {
    if (activeCategory === 'all') {
      return chores;
    }
    return chores.filter(chore => chore.category === activeCategory);
  }, [chores, activeCategory]);
  
  // Show schedule based on activeCategory
  const showSchedule = useMemo(() => {
    return activeCategory === 'schedule' || activeCategory === 'all';
  }, [activeCategory]);
  
  // Group chores by status for display
  const pendingChores = useMemo(() => 
    filteredChores.filter(chore => chore.status === 'pending'),
    [filteredChores]
  );
  
  const completedChores = useMemo(() => 
    filteredChores.filter(chore => chore.status === 'completed'),
    [filteredChores]
  );
  
  // Get current user
  const currentUser = users.find(user => user.id === currentUserId);
  
  return (
    <Layout onCategoryChange={setActiveCategory}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Chores */}
        <div className="lg:col-span-2 space-y-6">
          {/* User indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: users.find(user => user.id === currentUserId)?.color || '#cbd5e0' }}
              >
                {users.find(user => user.id === currentUserId)?.name.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium">{users.find(user => user.id === currentUserId)?.name || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 items-center">
              <div className="px-3 py-1 bg-purple-100 rounded-full">
                <span className="text-sm font-medium text-purple-700">{userPoints} points</span>
              </div>
              <button
                onClick={handleSwitchUser}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
              >
                Switch User
              </button>
            </div>
          </div>
          
          {/* Chores List */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">This Week's Chores</h2>
              <button
                onClick={() => setShowAddChoreForm(true)}
                className="px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-md text-sm font-medium text-purple-700 transition-colors"
              >
                Add Chore
              </button>
            </div>
            
            <ChoresList
              chores={filteredChores}
              users={users}
              currentUserId={currentUserId}
              onCompleteChore={handleCompleteChore}
              onDeleteChore={handleDeleteChore}
            />
          </div>
          
          {/* Pet Schedule - NEW COMPONENT */}
          {showSchedule && (
            <PetSchedule
              schedule={schedule}
              users={users}
              currentUserId={currentUserId}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}
          
          {/* Chat section */}
          <Chat
            messages={messages}
            users={users}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
        
        {/* Right column - Rewards */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-purple-50 to-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Belöningar
              </h3>
              <button
                onClick={() => setShowAddRewardForm(!showAddRewardForm)}
                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                {showAddRewardForm ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Avbryt
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Lägg till belöning
                  </>
                )}
              </button>
            </div>
            
            {showAddRewardForm ? (
              <AddRewardForm 
                onAddReward={handleAddReward} 
                onCancel={() => setShowAddRewardForm(false)} 
              />
            ) : (
              <RewardsList
                rewards={rewards}
                users={users}
                currentUserId={currentUserId}
                userPoints={userPoints}
                onClaim={handleClaimReward}
                onDelete={handleDeleteReward}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Section for adding new chores */}
      <div className="mt-6 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Lägg till ny uppgift
          </h3>
          <button
            onClick={() => setShowAddChoreForm(!showAddChoreForm)}
            className="flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {showAddChoreForm ? "Avbryt" : "Lägg till uppgift"}
          </button>
        </div>
        
        {showAddChoreForm && (
          <AddChoreForm 
            onAddChore={handleAddChore} 
            onCancel={() => setShowAddChoreForm(false)} 
          />
        )}
      </div>

      <div className="text-sm text-purple-700">
        {messages.length} {messages.length === 1 ? 'meddelande' : 'meddelanden'}
      </div>
    </Layout>
  );
};

export default Dashboard; 