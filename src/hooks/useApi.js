import { useState, useEffect } from 'react';

// API-URL konfiguration - ändra baserat på deployment-miljö
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cleanlife-db.vercel.app'; // Faktiska produktions-URL för API:et
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
 * Hook för att hantera API-anrop
 * @param {string} endpoint - API-endpoint att anropa
 * @param {Array|Object} defaultValue - Standardvärde att använda om data inte kan hämtas
 * @returns {[data, updateData, isLoading, error]} - State och funktioner för att hantera API-data
 */
const useApi = (endpoint, defaultValue = []) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Funktion för att hämta data från API:et
  const fetchData = async () => {
    let attemptsLeft = 2; // Minska till 2 försök för snabbare fallback
    let lastError = null;
    
    // Försök med portar
    while (attemptsLeft > 0 && apiAvailable) {
      try {
        setIsLoading(true);
        
        // Bestäm vilken URL vi ska använda
        let currentApiUrl;
        
        if (process.env.NODE_ENV === 'production') {
          currentApiUrl = 'https://cleanlife-db.vercel.app';
        } else {
          // Använd tidigare fungerande port om sådan finns
          currentApiUrl = window.API_URL_OVERRIDE || 'http://localhost:3001';
        }
        
        console.log(`Försöker ansluta till: ${currentApiUrl}${endpoint}`);
        
        // Sätt en timeout för att inte vänta för länge
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sekunder timeout
        
        try {
          const response = await fetch(`${currentApiUrl}${endpoint}`, {
            headers: { 'Cache-Control': 'no-cache' },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Nätverksfel: ${response.status} ${response.statusText}`);
          }
          
          const result = await response.json();
          
          // Spara den fungerande URL:en för framtida anrop
          window.API_URL_OVERRIDE = currentApiUrl;
          
          setData(result);
          setError(null);
          setApiAvailable(true);
          setIsLoading(false);
          return result;
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (err) {
        lastError = err;
        console.error(`Försök ${2 - attemptsLeft + 1} misslyckades:`, err.message);
        
        // Om det är en timeout eller nätverksfel, prova med en annan port
        if (err.name === 'AbortError' || err.message.includes('Failed to fetch') || 
            err.message.includes('NetworkError') || err.message.includes('Network request failed')) {
          // Prova port 3002 om vi använde 3001, eller tvärtom
          if (window.API_URL_OVERRIDE === 'http://localhost:3001') {
            window.API_URL_OVERRIDE = 'http://localhost:3002';
          } else if (window.API_URL_OVERRIDE === 'http://localhost:3002') {
            window.API_URL_OVERRIDE = 'http://localhost:3001';
          } else {
            window.API_URL_OVERRIDE = 'http://localhost:3002';
          }
        }
        
        attemptsLeft--;
        
        if (attemptsLeft > 0) {
          // Vänta en kort stund innan nästa försök
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Om vi kom hit har alla försök misslyckats - använd defaultValue
    console.warn(`Kunde inte ansluta till API-servern - använder standarddata för ${endpoint}`);
    setData(defaultValue);
    setError(`API-servern är inte tillgänglig. Använder lokal data istället. Fel: ${lastError?.message}`);
    setApiAvailable(false);
    setIsLoading(false);
    return defaultValue;
  };

  // Funktion för att uppdatera data via API:et
  const updateData = async (newData) => {
    // Om API inte är tillgängligt, uppdatera bara lokal data
    if (!apiAvailable) {
      console.warn(`API ej tillgängligt - uppdaterar endast lokalt för ${endpoint}`);
      
      // För array-data, lägg till nytt objekt i array
      if (Array.isArray(data)) {
        // Om det är en array av objekt vi ska skicka
        if (Array.isArray(newData)) {
          setData([...data, ...newData]);
        } else {
          // Säkerställ att objektet har ett id
          const updatedItem = {
            ...newData,
            id: newData.id || `local_${Date.now()}` // Skapa ett temporärt id om det saknas
          };
          setData([...data, updatedItem]);
        }
      } else {
        // För enskilda objekt, uppdatera objekt
        setData({ ...data, ...newData });
      }
      
      // Signalera att operationen lyckades lokalt
      return true;
    }
    
    // Om API är tillgängligt, försök skicka data
    let attemptsLeft = 2;
    let lastError = null;
    
    // Använd samma API_URL som fetchData lyckades med om det finns
    const getCurrentApiUrl = () => {
      if (window.API_URL_OVERRIDE) {
        return window.API_URL_OVERRIDE;
      }
      return process.env.NODE_ENV === 'production' 
        ? 'https://cleanlife-db.vercel.app' 
        : 'http://localhost:3001';
    };
    
    while (attemptsLeft > 0) {
      try {
        // Använd den senast fungerande URL:en
        const currentApiUrl = getCurrentApiUrl();
        
        // Sätt en timeout för att inte vänta för länge
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sekunder timeout
        
        try {
          const response = await fetch(`${currentApiUrl}${endpoint}`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(newData),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
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
        } catch (fetchError) {
          clearTimeout(timeoutId);
          throw fetchError;
        }
      } catch (err) {
        lastError = err;
        console.error(`Uppdateringsförsök ${2 - attemptsLeft + 1} misslyckades:`, err.message);
        
        // Om det är ett timeout- eller nätverksfel
        if (err.name === 'AbortError' || err.message.includes('Failed to fetch') || 
            err.message.includes('NetworkError') || err.message.includes('Network request failed')) {
          
          // Gå till offline-läge om vi får nätverksfel
          if (attemptsLeft === 1) {
            setApiAvailable(false);
          }
        }
        
        attemptsLeft--;
        
        // Om det är sista försöket, uppdatera lokalt i alla fall
        if (attemptsLeft === 0) {
          console.warn(`Kunde inte uppdatera via API - uppdaterar endast lokalt för ${endpoint}`);
          
          // För array-data, lägg till nytt objekt i array
          if (Array.isArray(data)) {
            // Om det är en array av objekt vi ska skicka
            if (Array.isArray(newData)) {
              setData([...data, ...newData]);
            } else {
              // Säkerställ att objektet har ett id
              const updatedItem = {
                ...newData,
                id: newData.id || `local_${Date.now()}` // Skapa ett temporärt id om det saknas
              };
              setData([...data, updatedItem]);
            }
          } else {
            // För enskilda objekt, uppdatera objekt
            setData({ ...data, ...newData });
          }
        } else {
          // Vänta en kort stund innan nästa försök
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Om vi inte avbröt tidigare, betyder det att lokal uppdatering redan gjorts
    return true;
  };

  // Hämta data när komponenten monteras eller endpoint ändras
  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return [data, updateData, isLoading, error, fetchData];
};

export default useApi; 