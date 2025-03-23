import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationToast from './NotificationToast';
// Importera ikoner från react-icons
import { FaListUl, FaUtensils, FaBroom, FaPaw, FaTshirt, FaProjectDiagram, FaGift } from 'react-icons/fa';

// Layout component for the entire application
const Layout = ({ children, onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  // If we're on rewards page, set active category to 'rewards'
  useEffect(() => {
    if (location.pathname === '/rewards') {
      setActiveCategory('rewards');
    }
  }, [location.pathname]);

  // Scroll to top whenever the path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const categories = [
    { 
      id: 'all', 
      name: 'Alla Uppgifter',
      icon: <FaListUl size={16} />
    },
    { 
      id: 'mat', 
      name: 'Mat',
      icon: <FaUtensils size={16} />
    },
    { 
      id: 'stad', 
      name: 'Städning',
      icon: <FaBroom size={16} />
    },
    { 
      id: 'sickan', 
      name: 'Sickan',
      icon: <FaPaw size={16} />
    },
    { 
      id: 'tvatt', 
      name: 'Tvätt',
      icon: <FaTshirt size={16} />
    },
    { 
      id: 'major', 
      name: 'Projekt',
      icon: <FaProjectDiagram size={16} />
    },
    { 
      id: 'rewards', 
      name: 'Belöningar',
      icon: <FaGift size={16} />
    }
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    
    // If we click on rewards category, navigate to rewards page
    if (categoryId === 'rewards') {
      navigate('/rewards');
      return;
    }
    
    // If we're on the rewards page and click a regular category, navigate back to home
    if (location.pathname === '/rewards') {
      navigate('/');
    }
    
    // For other categories, call the parent handler and scroll to top
    if (onCategoryChange && categoryId !== 'rewards') {
      onCategoryChange(categoryId);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-purple-800 tracking-tight">CleanLife</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <p className="text-sm font-medium text-purple-800 px-3 py-1 bg-purple-100 rounded-full shadow-sm">Hushållssysslor</p>
          </div>
        </div>
        
        {/* Navigation Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-8 h-8 text-sm font-medium rounded-full flex items-center justify-center transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-100 text-purple-800 shadow-sm'
                    : 'text-gray-700 hover:text-purple-800 hover:bg-purple-50'
                }`}
                title={category.name}
              >
                {category.icon}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="bg-transparent flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-700 text-center">CleanLife · Gör hushållssysslor enklare</p>
        </div>
      </footer>
      
      {/* Notification container */}
      <NotificationToast />
    </div>
  );
};

export default Layout; 