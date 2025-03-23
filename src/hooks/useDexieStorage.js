import { useState, useEffect } from 'react';
import db, { saveToDb, getAllFromDb } from '../utils/database';

// En custom hook för att använda Dexie/IndexedDB med React state
const useDexieStorage = (table, initialValue = []) => {
  // State för att lagra hämtad data
  const [storedValue, setStoredValue] = useState(initialValue);
  // State för att hålla koll på om data laddas in
  const [isLoading, setIsLoading] = useState(true);
  // State för att spåra eventuella fel
  const [error, setError] = useState(null);

  // Hämta data från databasen när komponenten monteras
  useEffect(() => {
    let isMounted = true; // Spåra om komponenten fortfarande är monterad
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      
      try {
        // Fallback till att använda initialValue om tabellen inte finns
        if (!db[table]) {
          console.warn(`Tabellen ${table} finns inte, använder initialValue`);
          setStoredValue(initialValue);
          setError(null);
          setIsLoading(false);
          return;
        }
        
        // Kontrollera om tabellen finns och har data
        let data = await getAllFromDb(table, initialValue);
        
        // Endast uppdatera state om komponenten fortfarande är monterad
        if (isMounted) {
          // Om ingen data finns och vi har initialValue, lägg till den
          if (!data || (Array.isArray(data) && data.length === 0) && initialValue) {
            try {
              // Vänta inte på detta för att snabba upp UI-rendering
              saveToDb(table, initialValue).then(() => {
                console.log(`Initialiserade ${table} med standarddata`);
              });
              data = initialValue;
            } catch (saveError) {
              console.error(`Fel vid initiering av data i ${table}:`, saveError);
              // Fortsätt med initialValue även om spara misslyckades
              data = initialValue;
            }
          }
          
          setStoredValue(data);
          setError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Fel vid laddning av data från ${table}:`, error);
        if (isMounted) {
          setStoredValue(initialValue);
          setError(error);
          setIsLoading(false);
        }
      }
    };

    // Kör data-hämtning
    fetchData();
    
    // Städa upp när komponenten avmonteras
    return () => {
      isMounted = false;
    };
  }, [table, initialValue]);

  // Funktion för att uppdatera data i både state och databasen
  const setValue = async (value) => {
    try {
      // Tillåt value att vara en funktion för att ha samma API som useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Uppdatera state först för bättre användargränssnitt
      setStoredValue(valueToStore);
      
      // Sedan spara data i databasen om den finns
      if (db[table]) {
        await saveToDb(table, valueToStore);
      } else {
        console.warn(`Kunde inte spara till ${table}, databasetabell saknas`);
      }
      
      return true;
    } catch (error) {
      console.error(`Fel vid uppdatering av data i ${table}:`, error);
      // Vi behåller ändå den uppdaterade state-datan även om databasespara misslyckades
      return false;
    }
  };

  // Skapa en prenumerationsfunktion för realtidsuppdateringar - endast om databasen är tillgänglig
  useEffect(() => {
    // Kontrollera att tabellen existerar i databasen
    if (!db[table]) {
      return; // Skippa prenumeration om tabellen inte finns
    }
    
    // Kontrollera om databasen är öppen
    if (db.isOpen()) {
      try {
        // Funktion för att lyssna efter ändringar i databasen
        const subscription = db[table].hook('creating updating deleting', () => {
          // Uppdatera state med senaste data från databasen
          getAllFromDb(table, initialValue)
            .then(newData => {
              setStoredValue(newData);
            })
            .catch(error => {
              console.error(`Fel vid uppdatering från prenumeration för ${table}:`, error);
            });
        });
        
        // Avregistrera prenumerationen när komponenten demonteras
        return () => {
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.error(`Fel vid avprenumeration för ${table}:`, error);
          }
        };
      } catch (error) {
        console.error(`Kunde inte skapa prenumeration för ${table}:`, error);
      }
    }
    
    return () => {}; // Tom cleanup-funktion
  }, [table, initialValue]);

  return [storedValue, setValue, isLoading, error];
};

export default useDexieStorage; 