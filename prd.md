Product Requirements Document (PRD): VenueFlow
1. Objective
Build a lightweight, real-time stadium crowd management and incident reporting application. The project must be highly responsive, deployable as a single Docker container on Google Cloud Run, and keep the git repository well under 10MB without using external LLMs or bulky mapping SDKs.

2. Target Audience

Attendees: Need instant visualization of crowd density and the ability to report physical bottlenecks or hazards.

Venue Staff: Need a real-time, low-latency dashboard to monitor reported incidents and update zone statuses.

3. Core Features

Interactive SVG Venue Map: A lightweight, custom SVG of a stadium divided into interactive zones (e.g., Gate A, Concourse B, Section 100).

Real-Time Status Indicators: Map zones change color (Green = Clear, Yellow = Busy, Red = Incident) based on server state.

"FanFlare" Reporting (WebSocket): Attendees click a zone to report an issue. This instantly broadcasts to the server and updates the map for all connected clients.

Single-Container Serving: The Node.js server handles WebSocket connections, REST APIs, and serves the static React frontend simultaneously.

4. Tech Stack

Deployment: Google Cloud Run (Single Docker Container, Stateless).

Backend / Signaling: Node.js, Express, Socket.io. (Stores zone states in-memory to bypass external database dependencies for the hackathon MVP).

Frontend: React, TypeScript, Vite.

Communication: WebSockets (Socket.io) for bi-directional, real-time updates.