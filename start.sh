#!/bin/bash

# Altissia Booster Startup Script
# This script starts both the server and client in development mode

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║    Altissia Booster Startup           ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    if systemctl is-active --quiet mongodb 2>/dev/null || pgrep -x mongod > /dev/null; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB is not running. Attempting to start...${NC}"
        sudo systemctl start mongodb 2>/dev/null || echo -e "${RED}❌ Failed to start MongoDB. Please start it manually.${NC}"
    fi
else
    echo -e "${YELLOW}⚠ MongoDB not found. Make sure it's installed and running.${NC}"
fi

# Check if dependencies are installed
echo -e "${BLUE}Checking dependencies...${NC}"

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
else
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
else
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
fi

# Kill existing processes on ports
echo -e "${BLUE}Checking for existing processes...${NC}"
fuser -k 5000/tcp 2>/dev/null && echo -e "${GREEN}✓ Cleared port 5000${NC}" || true
fuser -k 5173/tcp 2>/dev/null && echo -e "${GREEN}✓ Cleared port 5173${NC}" || true

# Start the services
echo -e "${BLUE}Starting services...${NC}"

# Start server in background
cd server
npm start &
SERVER_PID=$!
echo -e "${GREEN}✓ Server started (PID: $SERVER_PID)${NC}"
cd ..

# Wait a moment for server to start
sleep 2

# Start client in background
cd client
npm run dev &
CLIENT_PID=$!
echo -e "${GREEN}✓ Client started (PID: $CLIENT_PID)${NC}"
cd ..

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║    Services Started!                  ║"
echo "╠═══════════════════════════════════════╣"
echo "║  Server: http://localhost:5000        ║"
echo "║  Client: http://localhost:5173        ║"
echo "╠═══════════════════════════════════════╣"
echo "║  Press Ctrl+C to stop all services    ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    kill $SERVER_PID 2>/dev/null || true
    kill $CLIENT_PID 2>/dev/null || true
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
