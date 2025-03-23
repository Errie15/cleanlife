import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Rewards from './components/Rewards'
import './App.css'

// ScrollToTop komponent som återställer scroll-position vid navigering
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </Router>
  )
}

export default App
