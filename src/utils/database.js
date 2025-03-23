import Dexie from 'dexie';

// Skapa Dexie-databasen
let db;

try {
  // Skapa och konfigurera databasen
  db = new Dexie('cleanlifeDb');
  
  // Definiera databas-schema med versioner
  db.version(1).stores({
    users: 'id, name',
    chores: 'id, title, assignedTo, status',
    rewards: 'id, title, cost',
    messages: 'id, timestamp, userId',
    schedule: 'id, date, itemId, type',
    selectedProjects: 'id, value'
  });
  
  // Öppna databasen direkt för att fånga eventuella fel tidigt
  db.open().catch(err => {
    console.error('Kunde inte öppna Dexie-databasen:', err);
  });
} catch (error) {
  console.error('Fel vid skapande av Dexie-databas:', error);
  // Skapa en fallback-databas med minimal funktionalitet
  db = new Dexie('cleanlifeDbFallback');
  db.version(1).stores({
    users: 'id, name',
    chores: 'id',
    rewards: 'id',
    messages: 'id',
    schedule: 'id',
    selectedProjects: 'id'
  });
}

// Databasnycklar
export const DB_TABLES = {
  USERS: 'users',
  CHORES: 'chores',
  REWARDS: 'rewards',
  MESSAGES: 'messages',
  SCHEDULE: 'schedule',
  SELECTED_PROJECTS: 'selectedProjects'
};

// Spara data till en specifik tabell
export const saveToDb = async (table, data) => {
  try {
    if (!db[table]) {
      console.error(`Tabellen ${table} finns inte i databasen`);
      return false;
    }
    
    if (Array.isArray(data)) {
      // Om det är en array, ta bort tidigare data och lägg till ny
      await db[table].clear();
      await db[table].bulkPut(data);
    } else {
      // Om det är ett enskilt objekt, uppdatera/lägg till
      if (data.id) {
        await db[table].put(data);
      } else {
        await db[table].add(data);
      }
    }
    return true;
  } catch (error) {
    console.error(`Fel vid spara till databasen (${table}):`, error);
    return false;
  }
};

// Hämta alla data från en tabell
export const getAllFromDb = async (table, defaultValue = []) => {
  try {
    if (!db[table]) {
      console.error(`Tabellen ${table} finns inte i databasen`);
      return defaultValue;
    }
    
    const data = await db[table].toArray();
    return data.length > 0 ? data : defaultValue;
  } catch (error) {
    console.error(`Fel vid hämtning från databasen (${table}):`, error);
    return defaultValue;
  }
};

// Spara användare till databasen
export const saveUsers = async (users) => saveToDb(DB_TABLES.USERS, users);

// Hämta användare från databasen
export const getUsers = async (defaultValue = []) => getAllFromDb(DB_TABLES.USERS, defaultValue);

// Spara sysslor till databasen
export const saveChores = async (chores) => saveToDb(DB_TABLES.CHORES, chores);

// Hämta sysslor från databasen
export const getChores = async (defaultValue = []) => getAllFromDb(DB_TABLES.CHORES, defaultValue);

// Spara belöningar till databasen
export const saveRewards = async (rewards) => saveToDb(DB_TABLES.REWARDS, rewards);

// Hämta belöningar från databasen
export const getRewards = async (defaultValue = []) => getAllFromDb(DB_TABLES.REWARDS, defaultValue);

// Spara meddelanden till databasen
export const saveMessages = async (messages) => saveToDb(DB_TABLES.MESSAGES, messages);

// Hämta meddelanden från databasen
export const getMessages = async (defaultValue = []) => getAllFromDb(DB_TABLES.MESSAGES, defaultValue);

// Spara schema till databasen
export const saveSchedule = async (schedule) => saveToDb(DB_TABLES.SCHEDULE, schedule);

// Hämta schema från databasen
export const getSchedule = async (defaultValue = []) => getAllFromDb(DB_TABLES.SCHEDULE, defaultValue);

// Spara valda projekt till databasen
export const saveSelectedProjects = async (projects) => saveToDb(DB_TABLES.SELECTED_PROJECTS, projects);

// Hämta valda projekt från databasen
export const getSelectedProjects = async (defaultValue = []) => getAllFromDb(DB_TABLES.SELECTED_PROJECTS, defaultValue);

// Rensa all appdata
export const clearAllData = async () => {
  try {
    await Promise.all(
      Object.values(DB_TABLES).map(table => {
        if (db[table]) {
          return db[table].clear();
        }
        return Promise.resolve();
      })
    );
    return true;
  } catch (error) {
    console.error('Fel vid rensning av databasen:', error);
    return false;
  }
};

// Migrering: Flytta data från localStorage till IndexedDB
export const migrateFromLocalStorage = async () => {
  const localStorageKeys = {
    'cleanlife_users': DB_TABLES.USERS,
    'cleanlife_chores': DB_TABLES.CHORES,
    'cleanlife_rewards': DB_TABLES.REWARDS,
    'cleanlife_messages': DB_TABLES.MESSAGES,
    'cleanlife_schedule': DB_TABLES.SCHEDULE,
    'cleanlife_selected_projects': DB_TABLES.SELECTED_PROJECTS
  };

  try {
    // Logga att migrering påbörjas
    console.log('Påbörjar migrering från localStorage till IndexedDB...');
    
    for (const [lsKey, dbTable] of Object.entries(localStorageKeys)) {
      try {
        const data = localStorage.getItem(lsKey);
        if (data) {
          const parsedData = JSON.parse(data);
          console.log(`Migrerar ${lsKey} (${parsedData.length} objekt)`);
          const result = await saveToDb(dbTable, parsedData);
          if (result) {
            console.log(`Migrering av ${lsKey} lyckades`);
          } else {
            console.warn(`Migrering av ${lsKey} misslyckades`);
          }
        } else {
          console.log(`Ingen data hittades för ${lsKey}, hoppar över`);
        }
      } catch (innerError) {
        console.error(`Fel vid migrering av ${lsKey}:`, innerError);
        // Fortsätt med nästa nyckel trots fel
      }
    }
    
    console.log('Migrering slutförd');
    return true;
  } catch (error) {
    console.error('Fel vid migrering från localStorage:', error);
    return false;
  }
};

export default db; 