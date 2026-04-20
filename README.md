# PromptWars (VenueFlow)

project link: https://promptwar-715912890380.us-central1.run.app

**PromptWars** (internally referred to as VenueFlow) is a lightweight, real-time stadium crowd management and incident reporting application. It allows event attendees to report issues (bottlenecks, hazards, etc.) instantly and enables venue staff to monitor the stadium's status in real-time.

## 🚀 Features

- **Interactive SVG Venue Map**: A lightweight, custom SVG of a stadium divided into interactive zones (e.g., Gate A, Concourse B, Section 100).
- **Real-Time Status Indicators**: Map zones change color dynamically based on server state:
  - 🟢 **Green**: Clear
  - 🟡 **Yellow**: Busy
  - 🔴 **Red**: Incident reported
- **"FanFlare" Reporting**: attendees can click a zone to report an issue. This instantly broadcasts to the server and updates the map for all connected clients.
- **Single-Container Architecture**: The Node.js server handles WebSocket connections, REST APIs, and serves the static React frontend simultaneously.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, CSS Modules.
- **Backend**: Node.js, Express, Socket.io (Real-time signaling).
- **Deployment**: Google Cloud Run (Single Docker Container, Stateless).
- **State Management**: In-memory server state (Optimized for low-latency MVP).

## 📦 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ANAND-JATOTHU/PromptWars.git
   cd PromptWars
   ```

2. **Install Dependencies**:
   - For backend: `cd server && npm install`
   - For frontend: `cd client && npm install`

3. **Run Locally**:
   - Start backend: `cd server && node index.js`
   - Start frontend: `cd client && npm run dev`

## ☁️ Deployment to Cloud Run

The project is configured for one-click deployment using Google Cloud Run:

```bash
gcloud run deploy promptwar --source . --region us-central1 --allow-unauthenticated
```

## 📝 Project Structure

- `client/`: React/Vite frontend source code.
- `server/`: Node.js/Express backend and WebSocket signaling server.
- `Dockerfile`: Multi-stage build configuration.
- `prd.md`: Product Requirements Document.
