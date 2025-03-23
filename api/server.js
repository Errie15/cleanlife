const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Välkommen till CleanLife API' });
});

// -------------------- USER ENDPOINTS --------------------

// Hämta alla användare
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera användare
app.post('/api/users', async (req, res) => {
  try {
    const users = req.body;
    
    // Om det är en array, ta bort alla användare och lägg till nya
    if (Array.isArray(users)) {
      await prisma.user.deleteMany({});
      const createdUsers = await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
      });
      res.status(201).json(createdUsers);
    } else {
      // Om det är ett enskilt objekt
      const user = users;
      const createdUser = await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
      res.status(201).json(createdUser);
    }
  } catch (error) {
    console.error('Error creating/updating users:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- CHORE ENDPOINTS --------------------

// Hämta alla sysslor
app.get('/api/chores', async (req, res) => {
  try {
    const chores = await prisma.chore.findMany({
      include: { user: true }
    });
    res.json(chores);
  } catch (error) {
    console.error('Error getting chores:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera sysslor
app.post('/api/chores', async (req, res) => {
  try {
    const chores = req.body;
    
    // Om det är en array, ta bort alla sysslor och lägg till nya
    if (Array.isArray(chores)) {
      await prisma.chore.deleteMany({});
      const createdChores = await prisma.chore.createMany({
        data: chores.map(chore => ({
          ...chore,
          assignedTo: chore.assignedTo || null,
          dueDate: chore.dueDate ? new Date(chore.dueDate) : null
        })),
        skipDuplicates: true,
      });
      res.status(201).json(createdChores);
    } else {
      // Om det är ett enskilt objekt
      const chore = req.body;
      const createdChore = await prisma.chore.upsert({
        where: { id: chore.id },
        update: {
          ...chore,
          assignedTo: chore.assignedTo || null,
          dueDate: chore.dueDate ? new Date(chore.dueDate) : null
        },
        create: {
          ...chore,
          assignedTo: chore.assignedTo || null,
          dueDate: chore.dueDate ? new Date(chore.dueDate) : null
        },
      });
      res.status(201).json(createdChore);
    }
  } catch (error) {
    console.error('Error creating/updating chores:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- REWARD ENDPOINTS --------------------

// Hämta alla belöningar
app.get('/api/rewards', async (req, res) => {
  try {
    const rewards = await prisma.reward.findMany();
    res.json(rewards);
  } catch (error) {
    console.error('Error getting rewards:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera belöningar
app.post('/api/rewards', async (req, res) => {
  try {
    const rewards = req.body;
    
    // Om det är en array, ta bort alla belöningar och lägg till nya
    if (Array.isArray(rewards)) {
      await prisma.reward.deleteMany({});
      const createdRewards = await prisma.reward.createMany({
        data: rewards,
        skipDuplicates: true,
      });
      res.status(201).json(createdRewards);
    } else {
      // Om det är ett enskilt objekt
      const reward = req.body;
      const createdReward = await prisma.reward.upsert({
        where: { id: reward.id },
        update: reward,
        create: reward,
      });
      res.status(201).json(createdReward);
    }
  } catch (error) {
    console.error('Error creating/updating rewards:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- MESSAGE ENDPOINTS --------------------

// Hämta alla meddelanden
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      include: { user: true },
      orderBy: { timestamp: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera meddelanden
app.post('/api/messages', async (req, res) => {
  try {
    const messages = req.body;
    
    // Om det är en array, ta bort alla meddelanden och lägg till nya
    if (Array.isArray(messages)) {
      await prisma.message.deleteMany({});
      const createdMessages = await prisma.message.createMany({
        data: messages.map(message => ({
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        })),
        skipDuplicates: true,
      });
      res.status(201).json(createdMessages);
    } else {
      // Om det är ett enskilt meddelande
      const message = req.body;
      const createdMessage = await prisma.message.create({
        data: {
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        },
      });
      res.status(201).json(createdMessage);
    }
  } catch (error) {
    console.error('Error creating/updating messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- SCHEDULE ENDPOINTS --------------------

// Hämta hela schemat
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await prisma.schedule.findMany();
    res.json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera schema
app.post('/api/schedule', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Om det är en array av objekt
      
      // Rensa bort ogiltiga ID:n och förbered data
      const validScheduleData = req.body.map(item => {
        // Ta bort id om den är undefined, null, NaN eller tom sträng
        // så att Prisma kan generera en ny
        const scheduleData = { ...item };
        if (!scheduleData.id || scheduleData.id === "" || isNaN(scheduleData.id)) {
          delete scheduleData.id;
        }
        
        // Säkerställ giltigt datum
        scheduleData.date = isValidDate(item.date) ? new Date(item.date) : new Date();
        
        // Kontrollera obligatoriska fält
        scheduleData.itemId = scheduleData.itemId || 'default-item-id';
        scheduleData.type = scheduleData.type || 'unknown';
        
        return scheduleData;
      });
      
      // Skapa många poster på en gång
      const createdSchedule = await prisma.schedule.createMany({
        data: validScheduleData,
        skipDuplicates: true,
      });
      
      res.status(201).json(createdSchedule);
    } else {
      // Om det är ett enskilt objekt
      const scheduleItem = req.body;
      
      // Skapa en kopia av data för att undvika att modifiera original-objektet
      const scheduleData = { ...scheduleItem };
      
      // Säkerställ att obligatoriska fält finns
      scheduleData.itemId = scheduleData.itemId || 'default-item-id';
      scheduleData.type = scheduleData.type || 'unknown';
      
      // Ta bort id om den är ogiltig så att Prisma kan generera en ny
      if (!scheduleData.id || scheduleData.id === "" || isNaN(scheduleData.id)) {
        delete scheduleData.id;
        
        // För nya poster utan id, använd create istället för upsert
        const createdItem = await prisma.schedule.create({
          data: {
            ...scheduleData,
            date: isValidDate(scheduleData.date) ? new Date(scheduleData.date) : new Date()
          }
        });
        
        res.status(201).json(createdItem);
      } else {
        // För befintliga poster med giltigt id, använd upsert
        const createdScheduleItem = await prisma.schedule.upsert({
          where: { id: scheduleData.id },
          update: {
            ...scheduleData,
            date: isValidDate(scheduleData.date) ? new Date(scheduleData.date) : new Date()
          },
          create: {
            ...scheduleData,
            date: isValidDate(scheduleData.date) ? new Date(scheduleData.date) : new Date()
          },
        });
        
        res.status(201).json(createdScheduleItem);
      }
    }
  } catch (error) {
    console.error('Error creating/updating schedule:', error);
    res.status(500).json({ error: error.message });
  }
});

// Hjälpfunktion för att validera datum
function isValidDate(dateString) {
  if (!dateString) return false;
  
  // Om det redan är ett Date-objekt
  if (dateString instanceof Date) return !isNaN(dateString);
  
  // Om det är en sträng, försök skapa ett Date-objekt
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// -------------------- SELECTED PROJECTS ENDPOINTS --------------------

// Hämta valda projekt
app.get('/api/selected-projects', async (req, res) => {
  try {
    const selectedProjects = await prisma.selectedProject.findMany();
    res.json(selectedProjects);
  } catch (error) {
    console.error('Error getting selected projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// Skapa/uppdatera valda projekt
app.post('/api/selected-projects', async (req, res) => {
  try {
    const projects = req.body;
    
    // Om det är en array, ta bort alla projekt och lägg till nya
    if (Array.isArray(projects)) {
      await prisma.selectedProject.deleteMany({});
      const createdProjects = await prisma.selectedProject.createMany({
        data: projects.map((value, index) => ({
          id: `project_${index}`,
          value
        })),
        skipDuplicates: true,
      });
      res.status(201).json(createdProjects);
    } else {
      res.status(400).json({ error: 'Expected an array of project values' });
    }
  } catch (error) {
    console.error('Error creating/updating selected projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------- SERVER SETUP --------------------

const PORT = process.env.PORT || 3001;
const FALLBACK_PORTS = [3002, 3003, 3004, 3005, 3006];

// Försök att starta servern på en av de tillgängliga portarna
const startServer = (port, fallbackIndex = 0) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // Om porten är upptagen, försök med nästa port i listan
      if (fallbackIndex < FALLBACK_PORTS.length) {
        const nextPort = FALLBACK_PORTS[fallbackIndex];
        console.log(`Port ${port} is already in use, trying ${nextPort}...`);
        startServer(nextPort, fallbackIndex + 1);
      } else {
        console.error('Alla portar (3001-3006) är upptagna. Kunde inte starta servern.');
      }
    } else {
      console.error('Server error:', err);
    }
  });
};

// Starta servern på den primära porten
startServer(PORT); 