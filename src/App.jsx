import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Rewards from './components/Rewards'
import { migrateFromLocalStorage } from './utils/database'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Försök migrera data vid start
  useEffect(() => {
    const tryMigration = async () => {
      // Om migrering redan är genomförd, fortsätt direkt
      if (localStorage.getItem('migration_completed')) {
        setIsLoading(false)
        return
      }

      try {
        // Försök migrera data
        await migrateFromLocalStorage()
        // Markera migrering som klar oavsett resultat för att undvika upprepade försök
        localStorage.setItem('migration_completed', 'true')
      } catch (error) {
        console.error('Kunde inte migrera data:', error)
      } finally {
        // Fortsätt med appen oavsett migreringsstatus
        setIsLoading(false)
      }
    }

    // Sätt en timeout för att garantera att appen laddas även om migrering hänger
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        console.log('Timeout: fortsätter utan att vänta på migrering')
      }
    }, 3000)

    tryMigration()

    return () => clearTimeout(timeoutId)
  }, [isLoading])

  // Visa enkel laddningsindikator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-purple-600">Laddar...</div>
      </div>
    )
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
