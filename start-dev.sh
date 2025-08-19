#!/bin/bash

# Development startup script for City Emissions Simulator
echo "🚀 Starting City Emissions Simulator..."

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if backend dependencies are installed (Python virtual environment recommended)
echo "🐍 To install backend dependencies, run:"
echo "  cd backend"
echo "  pip install -r requirements.txt"
echo ""

# Start development servers
echo "🎯 Starting development servers..."
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""

# Use concurrently to start both servers
npm run dev
