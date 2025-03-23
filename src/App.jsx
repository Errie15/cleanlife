import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Rewards from './components/Rewards'
import { migrateToApi, isMigrated } from './utils/migrateToApi'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Försök migrera data vid start
  useEffect(() => {
    // Funktion för att försöka migrera data
    const tryMigration = async () => {
      try {
        console.log("Hoppar över migrering och startar appen direkt...");
        
        // Markera migrering som slutförd direkt utan att försöka migrera
        localStorage.setItem('migration_completed', 'true');
        
        // Fortsätt direkt till appen
        setIsLoading(false);
      } catch (err) {
        console.error("Oväntat fel:", err);
        setError(`Ett oväntat fel uppstod: ${err.message}`);
        setIsLoading(false);
      }
    };
    
    // Påbörja migrering när komponenten laddas
    tryMigration();
  }, []);

  // Visa spinner om appen laddas
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin mb-3 inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Laddar CleanLife</h2>
          <p className="text-gray-600">Förbereder din upplevelse...</p>
        </div>
      </div>
    );
  }

  // Visa felmeddelande om något gick fel
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4 text-5xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oj! Något gick fel</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                tryMigration();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Försök igen
            </button>
            <button 
              onClick={() => {
                // Skippa migreringen helt och markera den som klar
                localStorage.setItem('migration_completed', 'true');
                setError(null);
                setIsLoading(false);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              Skippa migrering
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Om du skippar migreringen kommer du att börja med en tom databas utan tidigare data.
            <br />
            Ny data du lägger till kommer sparas direkt i databasen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </Router>
  )
}

export default App
