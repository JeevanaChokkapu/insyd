#!/bin/bash

# Script to start both backend and frontend servers
# Usage: ./start-dev.sh

echo "Starting Insyd Inventory Management System..."
echo ""

# Start backend server in background
echo "Starting backend server on port 3001..."
node server/index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "Starting frontend server on port 3000..."
npm run dev

# When frontend stops, kill backend
kill $BACKEND_PID 2>/dev/null

