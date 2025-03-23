import React, { useState, useEffect, useRef } from 'react';
import useApi from '../hooks/useApi';
import { CATEGORY } from '../models/chores';

/**
 * ProjectDecisionMaker component
 * Allows users to select between project options and randomly choose one
 * using either a coin flip (2 options), dice roll (3-6 options), or spinning wheel (>6 options)
 */
const ProjectDecisionMaker = ({ chores }) => {
  // Store the selected projects for this decision session
  const [selectedProjects, setSelectedProjects, projectsLoading, projectsError] = useApi('/api/selected-projects', ['', '']);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animationFrames, setAnimationFrames] = useState(15);
  const wheelCanvasRef = useRef(null);
  
  // Filter major projects from the chores list
  const majorProjects = chores ? chores.filter(chore => chore.category === CATEGORY.MAJOR) : [];
  
  // Om data fortfarande laddas, visa en laddningsindikator
  if (projectsLoading) {
    return (
      <div className="bg-sky-100 p-4 rounded-lg mb-6">
        <div className="text-center text-primary">Laddar projektväljardata...</div>
      </div>
    );
  }
  
  // Om det finns fel, visa felmeddelande
  if (projectsError) {
    return (
      <div className="bg-pink-100 p-4 rounded-lg mb-6">
        <div className="text-center text-red-500">
          Kunde inte ladda projektdata. Försök igen senare.
        </div>
      </div>
    );
  }
  
  // Handle adding a project option
  const handleAddProject = () => {
    setSelectedProjects([...selectedProjects, '']);
    // Reset any previous results
    resetDecisionMaker();
  };

  // Handle removing a project option (min 2)
  const handleRemoveProject = (indexToRemove) => {
    if (selectedProjects.length > 2) {
      const updatedProjects = selectedProjects.filter((_, index) => index !== indexToRemove);
      setSelectedProjects(updatedProjects);
      // Reset any previous results
      resetDecisionMaker();
    }
  };

  // Handle project selection from dropdown
  const handleProjectSelect = (index, value) => {
    const updatedProjects = [...selectedProjects];
    updatedProjects[index] = value;
    setSelectedProjects(updatedProjects);
  };

  // Draw the wheel with the current projects
  const drawWheel = (projects, highlightedIndex = null) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel segments
    const numProjects = projects.length;
    const anglePerProject = (2 * Math.PI) / numProjects;
    
    for (let i = 0; i < numProjects; i++) {
      const startAngle = i * anglePerProject;
      const endAngle = (i + 1) * anglePerProject;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Fill with alternating colors, highlight the selected segment
      if (i === highlightedIndex) {
        ctx.fillStyle = '#9061f9'; // Highlighted segment (purple)
      } else {
        ctx.fillStyle = i % 2 === 0 ? '#e9d5ff' : '#d8b4fe'; // Light purple alternating
      }
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text
      const midAngle = startAngle + (anglePerProject / 2);
      const textRadius = radius * 0.75; // Position text at 75% of radius
      const textX = centerX + textRadius * Math.cos(midAngle);
      const textY = centerY + textRadius * Math.sin(midAngle);
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle + Math.PI / 2); // Rotate text to be tangent to the wheel
      
      ctx.fillStyle = '#4b5563';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Truncate text if too long
      let displayText = projects[i];
      if (displayText.length > 12) {
        displayText = displayText.substring(0, 10) + '...';
      }
      
      ctx.fillText(displayText, 0, 0);
      ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX - 10, centerY - 30);
    ctx.lineTo(centerX + 10, centerY - 30);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  };

  // Start the randomization animation
  const startRandomization = () => {
    // Validate that at least 2 projects have names
    const validProjects = selectedProjects.filter(project => project.trim() !== '');
    if (validProjects.length < 2) {
      alert('Du måste välja minst två projekt');
      return;
    }

    setIsAnimating(true);
    setShowResult(false);
    setResult(null);
    
    // Different animation handling based on number of projects
    if (selectedProjects.length > 6) {
      // Spinning wheel animation
      let angle = 0;
      const spinSpeed = 0.2;
      const spinTime = 3000; // 3 seconds
      const startTime = Date.now();
      
      const animateWheel = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / spinTime;
        
        // Slow down gradually
        const currentSpeed = spinSpeed * (1 - Math.min(progress, 1) * 0.8);
        angle += currentSpeed;
        
        // Calculate which segment is highlighted
        const numProjects = selectedProjects.length;
        const anglePerProject = (2 * Math.PI) / numProjects;
        const highlightedIndex = Math.floor(((angle % (2 * Math.PI)) / (2 * Math.PI)) * numProjects);
        
        // Update visual
        drawWheel(selectedProjects, highlightedIndex);
        setSelectedProjectIndex(highlightedIndex);
        
        if (elapsed < spinTime) {
          requestAnimationFrame(animateWheel);
        } else {
          // Animation complete
          const finalIndex = Math.floor(((angle % (2 * Math.PI)) / (2 * Math.PI)) * numProjects);
          setIsAnimating(false);
          setResult(finalIndex);
          setShowResult(true);
        }
      };
      
      // Start animation
      animateWheel();
    } else {
      // Coin flip or dice roll animation
      // Determine the number of animation frames based on project count
      // More projects = longer animation
      const frameCount = selectedProjects.length === 2 ? 15 : 20 + (selectedProjects.length * 2);
      setAnimationFrames(frameCount);
      
      // Animate through different options
      let counter = 0;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * selectedProjects.length);
        setSelectedProjectIndex(randomIndex);
        counter++;
        
        // Slow down animation near the end for more suspense
        if (counter > frameCount * 0.7) {
          clearInterval(interval);
          
          // Slower second phase
          const slowInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * selectedProjects.length);
            setSelectedProjectIndex(randomIndex);
            counter++;
            
            if (counter >= frameCount) {
              clearInterval(slowInterval);
              // Final result
              const finalRandomIndex = Math.floor(Math.random() * selectedProjects.length);
              setSelectedProjectIndex(finalRandomIndex);
              setIsAnimating(false);
              setResult(finalRandomIndex);
              setShowResult(true);
            }
          }, 150); // Slower interval for end of animation
        }
      }, 80); // Initial fast animation
    }
  };

  // Initialize wheel on first render and when projects change
  useEffect(() => {
    if (selectedProjects.length > 6 && wheelCanvasRef.current) {
      drawWheel(selectedProjects, selectedProjectIndex);
    }
  }, [selectedProjects, selectedProjectIndex]);

  // Reset the decision maker
  const resetDecisionMaker = () => {
    setSelectedProjectIndex(null);
    setShowResult(false);
    setResult(null);
  };

  // Render a dice face based on the result
  const renderDiceFace = (number) => {
    const dots = [];
    const containerClass = "w-12 h-12 bg-white rounded-lg border-2 border-purple-600 flex flex-wrap p-1";
    
    // Create dot positions based on the dice number
    switch(number) {
      case 1:
        dots.push(<div key="center" className="w-3 h-3 bg-purple-600 rounded-full m-auto"></div>);
        break;
      case 2:
        dots.push(<div key="topleft" className="w-3 h-3 bg-purple-600 rounded-full ml-auto"></div>);
        dots.push(<div key="bottomright" className="w-3 h-3 bg-purple-600 rounded-full mt-auto"></div>);
        break;
      case 3:
        dots.push(<div key="topleft" className="w-3 h-3 bg-purple-600 rounded-full ml-auto"></div>);
        dots.push(<div key="center" className="w-3 h-3 bg-purple-600 rounded-full m-auto"></div>);
        dots.push(<div key="bottomright" className="w-3 h-3 bg-purple-600 rounded-full mt-auto"></div>);
        break;
      case 4:
        dots.push(<div key="topleft" className="w-3 h-3 bg-purple-600 rounded-full"></div>);
        dots.push(<div key="topright" className="w-3 h-3 bg-purple-600 rounded-full ml-auto"></div>);
        dots.push(<div key="bottomleft" className="w-3 h-3 bg-purple-600 rounded-full mt-auto"></div>);
        dots.push(<div key="bottomright" className="w-3 h-3 bg-purple-600 rounded-full mt-auto ml-auto"></div>);
        break;
      case 5:
        dots.push(<div key="topleft" className="w-3 h-3 bg-purple-600 rounded-full"></div>);
        dots.push(<div key="topright" className="w-3 h-3 bg-purple-600 rounded-full ml-auto"></div>);
        dots.push(<div key="center" className="w-3 h-3 bg-purple-600 rounded-full m-auto"></div>);
        dots.push(<div key="bottomleft" className="w-3 h-3 bg-purple-600 rounded-full mt-auto"></div>);
        dots.push(<div key="bottomright" className="w-3 h-3 bg-purple-600 rounded-full mt-auto ml-auto"></div>);
        break;
      case 6:
        dots.push(<div key="topleft" className="w-3 h-3 bg-purple-600 rounded-full"></div>);
        dots.push(<div key="topright" className="w-3 h-3 bg-purple-600 rounded-full ml-auto"></div>);
        dots.push(<div key="middleleft" className="w-3 h-3 bg-purple-600 rounded-full my-auto"></div>);
        dots.push(<div key="middleright" className="w-3 h-3 bg-purple-600 rounded-full my-auto ml-auto"></div>);
        dots.push(<div key="bottomleft" className="w-3 h-3 bg-purple-600 rounded-full mt-auto"></div>);
        dots.push(<div key="bottomright" className="w-3 h-3 bg-purple-600 rounded-full mt-auto ml-auto"></div>);
        break;
      default:
        dots.push(<div key="center" className="w-3 h-3 bg-purple-600 rounded-full m-auto"></div>);
    }
    
    return (
      <div className={containerClass}>
        {dots}
      </div>
    );
  };

  // Render a coin based on the result (K for heads, M for tails)
  const renderCoin = (side) => {
    const isTails = side === 1;
    
    return (
      <div className={`w-12 h-12 rounded-full border-2 ${isTails ? 'bg-purple-600 text-white' : 'bg-white text-purple-800'} border-purple-600 flex items-center justify-center font-bold text-xl`}>
        {isTails ? 'M' : 'K'}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        Projektväljare
      </h2>
      
      <div className="mb-4">
        <p className="text-gray-700 mb-2">
          Välj mellan 2 eller fler projekt och låt slumpen avgöra vilket du ska genomföra.
          {selectedProjects.length === 2 ? ' Singla slant mellan två alternativ.' 
           : selectedProjects.length <= 6 ? ' Kasta tärning för att välja mellan flera alternativ.'
           : ' Snurra hjulet för att slumpmässigt välja ett projekt.'}
        </p>
      </div>

      {/* Project selection area */}
      <div className="space-y-3 mb-6">
        {selectedProjects.map((project, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-2 ${
              selectedProjectIndex === index 
                ? 'bg-purple-100 p-2 rounded-md transition-colors shadow-sm' 
                : ''
            }`}
          >
            <span className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full font-medium">
              {index + 1}
            </span>
            <select
              value={project}
              onChange={(e) => handleProjectSelect(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={showResult || isAnimating}
            >
              <option value="">Välj projekt</option>
              {majorProjects.map((chore) => (
                <option key={chore.id} value={chore.title}>{chore.title}</option>
              ))}
            </select>
            {selectedProjects.length > 2 && !showResult && !isAnimating && (
              <button
                onClick={() => handleRemoveProject(index)}
                className="p-2 text-red-600 hover:text-red-800"
                aria-label="Ta bort projekt"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Wheel canvas for >6 options */}
      {selectedProjects.length > 6 && (
        <div className="mb-6 relative">
          <canvas 
            ref={wheelCanvasRef} 
            width="300" 
            height="300" 
            className="mx-auto border border-gray-200 rounded-lg"
          />
        </div>
      )}

      <div className="flex space-x-3 mb-4">
        {!showResult && !isAnimating && (
          <button
            onClick={handleAddProject}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            Lägg till alternativ
          </button>
        )}
        
        {!isAnimating && !showResult && (
          <button
            onClick={startRandomization}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center"
            disabled={majorProjects.length < 2}
          >
            {selectedProjects.length === 2 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Singla slant
              </>
            ) : selectedProjects.length <= 6 ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Kasta tärning
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Snurra hjulet
              </>
            )}
          </button>
        )}
        
        {(showResult || isAnimating) && (
          <button
            onClick={resetDecisionMaker}
            disabled={isAnimating}
            className={`px-4 py-2 ${isAnimating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-md transition-colors`}
          >
            Börja om
          </button>
        )}
      </div>

      {/* Show message if no major projects */}
      {majorProjects.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-700">
            Inga större projekt hittades. Lägg till större uppgifter med kategorin "Projekt" för att använda projektväljaren.
          </p>
        </div>
      )}

      {/* Animation element */}
      {isAnimating && selectedProjects.length <= 6 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg flex items-center animate-pulse">
          <div className="mr-3">
            {selectedProjects.length === 2 ? (
              <div className="w-12 h-12 rounded-full bg-purple-200 animate-spin flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-300"></div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-purple-200 animate-bounce flex items-center justify-center">
                <div className="w-10 h-10 rounded-lg bg-purple-300"></div>
              </div>
            )}
          </div>
          <p className="text-purple-700">
            {selectedProjects.length === 2 ? 'Singlar slant...' : 'Kastar tärning...'}
          </p>
        </div>
      )}

      {/* Result display */}
      {showResult && result !== null && (
        <div className="mt-6 p-4 bg-purple-100 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Resultat</h3>
          <div className="flex items-center space-x-3">
            {selectedProjects.length === 2 ? (
              renderCoin(result)
            ) : selectedProjects.length <= 6 ? (
              renderDiceFace(result + 1)
            ) : (
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {result + 1}
              </div>
            )}
            <div>
              <p className="text-sm text-purple-600">Du bör välja:</p>
              <p className="text-xl font-semibold text-purple-800">{selectedProjects[result]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDecisionMaker; 