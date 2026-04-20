# Stage 1: Build the React Application
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Setup the Node.js Express server
FROM node:20-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install

# Copy backend source
COPY server/ ./

# Copy built frontend from Stage 1 into the server folder
COPY --from=frontend-builder /app/client/dist ./public

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start server
CMD ["node", "index.js"]
