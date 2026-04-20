const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Use cors for local development where client is on port 5173
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Default starting state for Stadium Zones
let stadiumState = {
  gateA: { id: 'gateA', name: 'Gate A', status: 'clear' },
  gateB: { id: 'gateB', name: 'Gate B', status: 'clear' },
  concourseNorth: { id: 'concourseNorth', name: 'Concourse North', status: 'clear' },
  concourseSouth: { id: 'concourseSouth', name: 'Concourse South', status: 'clear' },
  section100: { id: 'section100', name: 'Section 100', status: 'clear' },
  section200: { id: 'section200', name: 'Section 200', status: 'clear' }
};

let activityLog = []; // Stores recent events

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current state immediately upon connection
  socket.emit('initialState', { stadiumState, activityLog });

  // Listen for FanFlare reports (status updates)
  socket.on('reportIssue', (data) => {
    const { zoneId, status } = data;
    
    if (stadiumState[zoneId]) {
      stadiumState[zoneId].status = status;
      console.log(`Zone ${zoneId} updated to ${status} by ${socket.id}`);
      
      const logEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        zoneName: stadiumState[zoneId].name,
        status: status
      };
      activityLog.unshift(logEntry);
      if (activityLog.length > 50) activityLog.pop();

      // Broadcast the update to all connected clients
      io.emit('stateUpdate', { stadiumState, activityLog });
    }
  });

  // Listen for Global Staff Announcements
  socket.on('sendAnnouncement', (message) => {
    console.log(`Global announcement: ${message}`);
    io.emit('announcement', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Serve the frontend build
// In production (Docker), the frontend will be built to the 'public' folder inside 'server'
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for SPA routing routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Port configuration (Google Cloud Run provides PORT in env, else 8080)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
