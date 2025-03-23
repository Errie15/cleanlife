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
      <div className="mb-6 bg-white rounded-xl shadow-sm hover:shadow transition-shadow duration-300 p-5 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600">
              Hej, {currentUser?.name || 'Användare'}
            </h2>
            <div className="flex items-center mt-1">
              <div className={`w-4 h-4 rounded-full mr-2 ${currentUserId === users[0].id ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
              <p className="text-base text-gray-700">
                Det är {weeklyUser.id === currentUserId ? 'din' : weeklyUser.name + 's'} vecka
              </p>
            </div>
            
            <div className="mt-2 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {userPoints} poäng
            </div>
          </div>
          
          <button
            onClick={handleSwitchUser}
            className="flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Byt användare
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Weekly chores column */}
        <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-indigo-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-indigo-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Denna vecka
            </h3>
            <button
              onClick={() => setShowAddChoreForm(!showAddChoreForm)}
              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              {showAddChoreForm ? (
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
                  Lägg till
                </>
              )}
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
        <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-green-50 to-white">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">Klara uppgifter</h3>
          </div>
          <ChoresList
            title="Färdiga"
            chores={completedChores}
            users={users}
            onComplete={handleCompleteChore}
            onDelete={handleDeleteChore}
          />
        </div>
        
        {/* Rewards & Major tasks column */}
        <div className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-purple-50 to-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Djup städning
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
            <>
              <ChoresList
                title="Större uppgifter"
                chores={majorChores}
                users={users}
                onComplete={handleCompleteChore}
                onDelete={handleDeleteChore}
              />
              
              <div className="mt-5">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-800">Belöningar</h4>
                </div>
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
      <div className="mt-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-5 border border-gray-200 animate-fade-in chat-container">
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