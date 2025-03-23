import React, { useState, useEffect, useMemo } from 'react';
import useApi from '../hooks/useApi';
import useNotifications from '../hooks/useNotifications';
import { sampleChores, getAssignedUser, CATEGORY } from '../models/chores';
import { sampleUsers } from '../models/users';
import { sampleMessages, addMessage } from '../models/messages';
import { sampleSchedule, DAYS_OF_WEEK, TIME_SLOTS } from '../models/schedule';
import { getUserPoints } from '../models/users';

import Layout from './Layout';
import ChoresList from './ChoresList';
import AddChoreForm from './AddChoreForm';
import Chat from './Chat';
import PetSchedule from './PetSchedule';
import ProjectDecisionMaker from './ProjectDecisionMaker';

// Main dashboard component
const Dashboard = () => {
  // State från API
  const [users, setUsers, usersLoading, usersError] = useApi('/api/users', sampleUsers);
  const [chores, setChores, choresLoading, choresError] = useApi('/api/chores', sampleChores);
  const [messages, setMessages, messagesLoading, messagesError] = useApi('/api/messages', sampleMessages);
  const [schedule, setSchedule, scheduleLoading, scheduleError] = useApi('/api/schedule', sampleSchedule);
  
  // UI state
  const [showAddChoreForm, setShowAddChoreForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Samla alla API-fel
  const apiErrors = [usersError, choresError, messagesError, scheduleError].filter(Boolean);
  const isLoading = usersLoading || choresLoading || messagesLoading || scheduleLoading;
  
  // Visa felmeddelande om något API-anrop misslyckas
  if (apiErrors.length > 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4 text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ett fel uppstod vid laddning av data</h2>
          <p className="text-gray-600 mb-6">
            Det verkar som att API-servern inte körs eller inte är tillgänglig. 
            <br />
            Fel: {apiErrors[0]}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Försök igen
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Kontrollera att API-servern körs med <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code> i api-mappen.
          </p>
        </div>
      </div>
    );
  }
  
  // Visa laddningsindikator om data fortfarande laddas
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-3 inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <div className="text-xl font-semibold text-gray-800 mb-2">Laddar data...</div>
        </div>
      </div>
    );
  }
  
  // Notifications
  const { notifyChoreCompleted } = useNotifications();
  
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
  
  // Show chores list based on activeCategory
  const showChoresList = useMemo(() => {
    return activeCategory !== 'sickan';
  }, [activeCategory]);
  
  // Show schedule based on activeCategory
  const showSchedule = useMemo(() => {
    return activeCategory === 'sickan' || activeCategory === 'all';
  }, [activeCategory]);
  
  // Show full schedule table
  const showFullSchedule = useMemo(() => {
    return activeCategory === 'sickan';
  }, [activeCategory]);
  
  // Show project decision maker based on activeCategory
  const showProjectDecisionMaker = useMemo(() => {
    return activeCategory === 'major';
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
  
  // Ensure all schedule slots are populated
  useEffect(() => {
    // Skip effect if schedule is already complete
    if (schedule.length >= DAYS_OF_WEEK.length * Object.keys(TIME_SLOTS).length) {
      return;
    }
    
    const allTimeSlots = Object.values(TIME_SLOTS);
    const missingEntries = [];

    // Check if all time slots are present for each day
    DAYS_OF_WEEK.forEach(day => {
      allTimeSlots.forEach(timeSlot => {
        const entry = schedule.find(s => s.day === day && s.timeSlot === timeSlot);
        if (!entry) {
          // Determine user based on alternating pattern
          const dayIndex = DAYS_OF_WEEK.indexOf(day);
          const slotIndex = allTimeSlots.indexOf(timeSlot);
          
          let userId;
          
          // Make Friday match Thursday's pattern
          if (day === 'Friday') {
            const thursdayPattern = (slotIndex % 2 === 0) ? 'user2' : 'user1'; // Thursday pattern: Linnea morning/evening, Erik afternoon/night
            userId = thursdayPattern;
          } 
          // Saturday - Erik morning/evening, Linnea afternoon/night (Sunday's original pattern)
          else if (day === 'Saturday') {
            userId = (slotIndex % 2 === 0) ? 'user1' : 'user2';
          }
          // Sunday - Linnea morning/evening, Erik afternoon/night (Saturday's original pattern)
          else if (day === 'Sunday') {
            userId = (slotIndex % 2 === 0) ? 'user2' : 'user1';
          }
          else {
            // Standard alternating pattern for other days
            const isEven = (dayIndex + slotIndex) % 2 === 0;
            userId = isEven ? 'user1' : 'user2'; // user1 = Erik, user2 = Linnea
          }
          
          missingEntries.push({
            id: `schedule_${day}_${timeSlot}_${Date.now()}`,
            day,
            timeSlot,
            assignedTo: userId,
            createdAt: new Date().toISOString()
          });
        }
      });
    });

    if (missingEntries.length > 0) {
      setSchedule(prev => [...prev, ...missingEntries]);
    }
  }, [schedule, DAYS_OF_WEEK, TIME_SLOTS, setSchedule]);
  
  // Sätt currentUserId när users har laddats
  useEffect(() => {
    if (!usersLoading && users && users.length > 0 && !currentUserId) {
      setCurrentUserId(users[0]?.id);
    }
  }, [users, usersLoading, currentUserId]);

  return (
    <Layout onCategoryChange={setActiveCategory}>
      <div className={`grid grid-cols-1 ${activeCategory !== 'sickan' ? 'lg:grid-cols-1' : ''} gap-6`}>
        {/* Left column - Chores */}
        <div className="space-y-6">
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
                <p className="text-sm text-gray-800">Inloggad som</p>
                <p className="font-medium">{users.find(user => user.id === currentUserId)?.name || 'Okänd'}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 items-center">
              <div className="px-3 py-1 bg-purple-100 rounded-full">
                <span className="text-sm font-medium text-purple-800">{userPoints} poäng</span>
              </div>
              <button
                onClick={handleSwitchUser}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-800 transition-colors"
              >
                Byt Användare
              </button>
            </div>
          </div>
          
          {/* Project Decision Maker */}
          {showProjectDecisionMaker && (
            <ProjectDecisionMaker chores={chores} />
          )}
          
          {/* Chores List */}
          {showChoresList && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Veckans Uppgifter</h2>
                <button
                  onClick={() => setShowAddChoreForm(!showAddChoreForm)}
                  className="px-3 py-2 bg-purple-200 hover:bg-purple-300 rounded-md text-sm font-medium text-purple-800 transition-colors"
                >
                  {showAddChoreForm ? "Avbryt" : "Lägg Till Uppgift"}
                </button>
              </div>
              
              {showAddChoreForm && (
                <div className="mt-4 p-4 rounded-xl bg-white shadow-sm">
                  <AddChoreForm 
                    onAddChore={handleAddChore} 
                    onCancel={() => setShowAddChoreForm(false)} 
                  />
                </div>
              )}
              
              <ChoresList
                title="Uppgifter"
                chores={filteredChores}
                users={users}
                currentUserId={currentUserId}
                onComplete={handleCompleteChore}
                onDelete={handleDeleteChore}
              />
            </div>
          )}
          
          {/* Pet Schedule - NEW COMPONENT */}
          {showSchedule && (
            <div className={`${activeCategory === 'sickan' ? 'max-w-5xl mx-auto w-full' : ''}`}>
              <PetSchedule
                schedule={schedule}
                users={users}
                currentUserId={currentUserId}
                onUpdateSchedule={handleUpdateSchedule}
                showFullSchedule={showFullSchedule}
              />
            </div>
          )}
          
          {/* Chat section */}
          <Chat
            messages={messages}
            users={users}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard; 