import db, { DB_TABLES } from './database';
import { getFromStorage } from './storage';

// API-URL konfiguration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://cleanlife-api.vercel.app' 
  : 'http://localhost:3001';

/**
 * Migrerar data från IndexedDB till PostgreSQL via API
 * @returns {Promise<boolean>} - true om migreringen lyckas
 */
export const migrateToApi = async () => {
  try {
    console.log('Startar migrering av data till API...');
    
    // Kontrollera om API:et är tillgängligt genom att anropa root-endpoint
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        return { 
          success: false, 
          message: `API:et svarar med statuskod ${response.status}` 
        };
      }
      const data = await response.json();
      console.log('API är tillgängligt:', data);
    } catch (error) {
      console.error('Kunde inte ansluta till API:et:', error);
      return { 
        success: false, 
        message: `Kunde inte ansluta till API:et: ${error.message}` 
      };
    }
    
    // Försök hämta data från IndexedDB/localStorage
    let migrationResults = {
      users: false,
      chores: false,
      rewards: false,
      messages: false,
      schedule: false,
      selectedProjects: false
    };
    
    let failureMessages = [];
    
    // Migrera användare
    try {
      const users = await getFromStorage(DB_TABLES.USERS);
      if (users && users.length > 0) {
        const response = await fetch(`${API_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(users)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Användare migrerade:', users.length);
        migrationResults.users = true;
      } else {
        console.warn('Inga användare att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av användare:', error);
      failureMessages.push(`Användare: ${error.message}`);
    }
    
    // Migrera sysslor
    try {
      const chores = await getFromStorage(DB_TABLES.CHORES);
      if (chores && chores.length > 0) {
        const response = await fetch(`${API_URL}/api/chores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chores)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Sysslor migrerade:', chores.length);
        migrationResults.chores = true;
      } else {
        console.warn('Inga sysslor att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av sysslor:', error);
      failureMessages.push(`Sysslor: ${error.message}`);
    }
    
    // Migrera belöningar
    try {
      const rewards = await getFromStorage(DB_TABLES.REWARDS);
      if (rewards && rewards.length > 0) {
        const response = await fetch(`${API_URL}/api/rewards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rewards)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Belöningar migrerade:', rewards.length);
        migrationResults.rewards = true;
      } else {
        console.warn('Inga belöningar att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av belöningar:', error);
      failureMessages.push(`Belöningar: ${error.message}`);
    }
    
    // Migrera meddelanden
    try {
      const messages = await getFromStorage(DB_TABLES.MESSAGES);
      if (messages && messages.length > 0) {
        const response = await fetch(`${API_URL}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messages)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Meddelanden migrerade:', messages.length);
        migrationResults.messages = true;
      } else {
        console.warn('Inga meddelanden att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av meddelanden:', error);
      failureMessages.push(`Meddelanden: ${error.message}`);
    }
    
    // Migrera schema
    try {
      const schedule = await getFromStorage(DB_TABLES.SCHEDULE);
      if (schedule && schedule.length > 0) {
        // Validera och formatera data innan de skickas till API
        const validatedSchedule = schedule.map(item => {
          // Skapa en kopia av objektet för att undvika att modifiera originalet
          const validItem = { ...item };
          
          // Om date är ett ogiltigt datum, ersätt med dagens datum
          if (validItem.date && new Date(validItem.date).toString() === 'Invalid Date') {
            console.warn(`Ogiltig datum i schema (id: ${validItem.id}), använder dagens datum istället`);
            validItem.date = new Date().toISOString();
          }
          
          // Säkerställ att obligatoriska fält finns
          validItem.itemId = validItem.itemId || validItem.id || 'default-item-id';
          validItem.type = validItem.type || 'unknown';
          
          return validItem;
        });
        
        const response = await fetch(`${API_URL}/api/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedSchedule)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Schema migrerat:', validatedSchedule.length);
        migrationResults.schedule = true;
      } else {
        console.warn('Inget schema att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av schema:', error);
      failureMessages.push(`Schema: ${error.message}`);
    }
    
    // Migrera valda projekt
    try {
      const selectedProjects = await getFromStorage(DB_TABLES.SELECTED_PROJECTS);
      if (selectedProjects && selectedProjects.length > 0) {
        const response = await fetch(`${API_URL}/api/selected-projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedProjects)
        });
        
        if (!response.ok) {
          throw new Error(`API svarade med: ${response.status}`);
        }
        
        console.log('Valda projekt migrerade:', selectedProjects.length);
        migrationResults.selectedProjects = true;
      } else {
        console.warn('Inga valda projekt att migrera');
      }
    } catch (error) {
      console.error('Fel vid migrering av valda projekt:', error);
      failureMessages.push(`Valda projekt: ${error.message}`);
    }
    
    // Markera migrering som slutförd
    localStorage.setItem('migration_completed', 'true');
    
    // Kontrollera om migreringen var delvis eller helt framgångsrik
    const successful = Object.values(migrationResults).some(result => result === true);
    const allSuccessful = Object.values(migrationResults).every(result => result === true);
    
    if (allSuccessful) {
      return { 
        success: true, 
        message: 'All data migrerad framgångsrikt' 
      };
    } else if (successful) {
      return { 
        success: true, 
        partialSuccess: true,
        message: 'Vissa data migrerades framgångsrikt, men inte alla',
        details: failureMessages.join('; ')
      };
    } else {
      return { 
        success: false, 
        message: 'Ingen data kunde migreras',
        details: failureMessages.join('; ')
      };
    }
  } catch (error) {
    console.error('Oväntat fel vid migrering:', error);
    return { 
      success: false, 
      message: `Oväntat fel vid migrering: ${error.message}` 
    };
  }
};

// Funktion för att kontrollera om migreringen redan är genomförd
export const isMigrated = async () => {
  try {
    // Kontrollera om migreringen är markerad som slutförd i localStorage
    const migrated = localStorage.getItem('migration_completed') === 'true';
    
    if (migrated) {
      return true;
    }
    
    // Om ingen migrering är genomförd, kontrollera även om det finns data i API:et
    // som kan tyda på att migrering redan gjorts på en annan enhet
    try {
      // Använd den senast fungerande URL:en om tillgänglig
      const currentApiUrl = typeof window !== 'undefined' && window.API_URL_OVERRIDE 
        ? window.API_URL_OVERRIDE 
        : API_URL;
        
      const response = await fetch(`${currentApiUrl}/api/users`);
      
      if (response.ok) {
        const users = await response.json();
        
        // Om vi hittar användare i API:et, markera migrering som slutförd
        if (users && users.length > 0) {
          console.log('Data hittades redan i API:et, markerar migrering som slutförd');
          localStorage.setItem('migration_completed', 'true');
          return true;
        }
      }
    } catch (error) {
      console.warn('Kunde inte kontrollera om data redan finns i API:et:', error);
    }
    
    return false;
  } catch (error) {
    console.error('Fel vid kontroll av migrationsstatus:', error);
    return false;
  }
}; 