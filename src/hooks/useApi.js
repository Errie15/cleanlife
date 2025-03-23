import { useState, useEffect } from 'react';

// API-URL konfiguration - ändra baserat på deployment-miljö
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cleanlife-api.vercel.app'; // Produktions-URL (när du deployar API:et)
  }
  
  // I utvecklingsläge börjar vi med port 3001
  // Först kommer fetchData att hantera fallbacks till andra portar om nödvändigt
  return 'http://localhost:3001';
};

// Initiera API_URL och se till att tidigare sparade värden är tillgängliga
const initializeApiUrl = () => {
  // Om vi redan har en fungerande port sparad (från en tidigare fallback-situation),
  // använd den istället för standard-URL
  if (typeof window !== 'undefined' && window.API_URL_OVERRIDE) {
    console.log(`Använder tidigare sparad API URL: ${window.API_URL_OVERRIDE}`);
    return window.API_URL_OVERRIDE;
  }
  
  // Annars använd standardvärdet
  return getApiUrl();
};

const API_URL = initializeApiUrl();

/**
 * Custom hook för att hantera data från API
 * @param {string} endpoint - API-endpoint (t.ex. "/api/users")
 * @param {any} defaultValue - Standardvärde innan data hämtas
 * @returns {Array} - [data, updateData, isLoading, error, refetch]
 */
const useApi = (endpoint, defaultValue = []) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funktion för att hämta data från API:et
  const fetchData = async () => {
    let attemptsLeft = 3; // Antal försök vi ska göra
    let lastError = null;
    
    // Lista på alla portar vi vill prova
    const possiblePorts = [3001, 3002, 3003, 3004, 3005, 3006];
    let currentPortIndex = 0;
    
    // Om vi har en tidigare fungerande port, börja med den istället
    if (window.API_URL_OVERRIDE) {
      const port = parseInt(window.API_URL_OVERRIDE.split(':').pop());
      const index = possiblePorts.indexOf(port);
      if (index >= 0) {
        currentPortIndex = index;
      }
    }
    
    // Försök med olika portar, med flera försök
    while (attemptsLeft > 0) {
      try {
        setIsLoading(true);
        
        // Bestäm vilken URL vi ska använda
        let currentApiUrl;
        
        if (process.env.NODE_ENV === 'production') {
          currentApiUrl = 'https://cleanlife-api.vercel.app';
        } else {
          // Använd nästa port i listan
          const port = possiblePorts[currentPortIndex];
          currentApiUrl = `http://localhost:${port}`;
          
          // Rotera till nästa port för nästa försök
          currentPortIndex = (currentPortIndex + 1) % possiblePorts.length;
        }
        
        console.log(`Försöker ansluta till: ${currentApiUrl}${endpoint}`);
        
        const response = await fetch(`${currentApiUrl}${endpoint}`, {
          headers: { 'Cache-Control': 'no-cache' } // Förhindra caching
        });
        
        if (!response.ok) {
          throw new Error(`Nätverksfel: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Spara den fungerande URL:en för framtida anrop
        window.API_URL_OVERRIDE = currentApiUrl;
        
        setData(result);
        setError(null);
        return result;
      } catch (err) {
        lastError = err;
        console.error(`Försök ${3 - attemptsLeft + 1} misslyckades:`, err.message);
        
        attemptsLeft--;
        
        // Vänta en kort stund innan nästa försök
        if (attemptsLeft > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Om vi kom hit har alla försök misslyckats
    setError(`Kunde inte ansluta till servern efter flera försök. Kontrollera att API-servern körs. Fel: ${lastError?.message}`);
    setIsLoading(false);
    return null;
  };

  // Funktion för att uppdatera data via API:et
  const updateData = async (newData) => {
    let attemptsLeft = 3;
    let lastError = null;
    
    // Använd samma API_URL som fetchData lyckades med om det finns
    // annars använd standard API_URL
    const getCurrentApiUrl = () => {
      if (window.API_URL_OVERRIDE) {
        return window.API_URL_OVERRIDE;
      }
      return process.env.NODE_ENV === 'production' 
        ? 'https://cleanlife-api.vercel.app' 
        : 'http://localhost:3001';
    };
    
    while (attemptsLeft > 0) {
      try {
        // Använd den senast fungerande URL:en
        const currentApiUrl = getCurrentApiUrl();
        
        const response = await fetch(`${currentApiUrl}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(newData)
        });
        
        if (!response.ok) {
          throw new Error(`Uppdateringsfel: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Uppdatera lokalt state för omedelbar UI-respons
        if (!Array.isArray(newData) && result) {
          setData(result);
        } else {
          // Om det är en array eller vi inte får tillbaka objektet, hämta all data igen
          fetchData();
        }
        
        return true;
      } catch (err) {
        lastError = err;
        console.error(`Uppdateringsförsök ${3 - attemptsLeft + 1} misslyckades:`, err.message);
        
        attemptsLeft--;
        
        // Om det misslyckades, återställ API_URL_OVERRIDE så att fetchData kan försöka med andra portar
        if (attemptsLeft > 0 && process.env.NODE_ENV !== 'production') {
          window.API_URL_OVERRIDE = null;
          // Vänta en kort stund innan nästa försök
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Försök hämta data för att hitta en fungerande URL
          await fetchData();
        }
      }
    }
    
    // Om vi kom hit har alla försök misslyckats
    setError(`Kunde inte uppdatera data efter flera försök. Kontrollera att API-servern körs. Fel: ${lastError?.message}`);
    return false;
  };

  // Hämta data när komponenten monteras eller endpoint ändras
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return [data, updateData, isLoading, error, fetchData];
};

export default useApi; 