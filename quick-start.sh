#!/bin/bash

# Palm Insight AI - Quick Start Script
# This script helps you get the entire system running quickly

set -e

echo "🧠 Palm Insight AI - Quick Start"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi
print_success "Python 3 is installed"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
print_success "Node.js is installed"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm is installed"

echo ""
echo "Prerequisites check complete!"
echo ""

# Check for .env file in backend
if [ ! -f "backend/.env" ]; then
    print_info "Creating .env file in backend directory..."
    cp backend/.env.example backend/.env
    print_success "Created backend/.env"
    print_info "Please edit backend/.env and add your OPENAI_API_KEY"
    echo ""
    read -p "Press Enter after adding your API key to continue..."
fi

# Setup backend
print_info "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_info "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
print_info "Installing Python dependencies..."
pip install --quiet -r requirements.txt
print_success "Backend dependencies installed"

cd ..
echo ""

# Setup web app
print_info "Setting up web application..."
cd web

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing Node dependencies..."
    npm install --silent
    print_success "Web dependencies installed"
else
    print_success "Web dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local for web app..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    print_success "Created web/.env.local"
fi

cd ..
echo ""

# Setup mobile app
print_info "Setting up mobile application..."
cd mobile

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing mobile dependencies..."
    npm install --silent
    print_success "Mobile dependencies installed"
else
    print_success "Mobile dependencies already installed"
fi

cd ..
echo ""

# Get local IP address for mobile app
print_info "Detecting local IP address for mobile app..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
else
    LOCAL_IP=$(hostname -I | awk '{print $1}')
fi

if [ ! -z "$LOCAL_IP" ]; then
    print_success "Detected local IP: $LOCAL_IP"
    print_info "Updating mobile app configuration..."

    # Update API URL in mobile app
    sed -i.bak "s|YOUR_BACKEND_URL_HERE|http://$LOCAL_IP:8000|g" mobile/services/api.ts
    rm mobile/services/api.ts.bak
    print_success "Mobile app configured with backend URL: http://$LOCAL_IP:8000"
fi

echo ""
echo "================================"
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "To start the system, run the following commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Terminal 2 (Web App):"
echo "  cd web"
echo "  npm run dev"
echo ""
echo "Terminal 3 (Mobile App - Optional):"
echo "  cd mobile"
echo "  npm start"
echo ""
echo "Then:"
echo "  • Open browser to http://localhost:3000 for web app"
echo "  • Scan QR code with Expo Go for mobile app"
echo ""
echo "================================"
echo ""

# Ask if user wants to start services now
read -p "Do you want to start the backend and web app now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting backend and web app..."

    # Start backend in background
    cd backend
    source venv/bin/activate
    python main.py &
    BACKEND_PID=$!
    cd ..

    # Wait for backend to start
    sleep 3

    # Start web app
    cd web
    npm run dev &
    WEB_PID=$!
    cd ..

    print_success "Services started!"
    echo ""
    echo "Backend running at: http://localhost:8000"
    echo "Web app running at: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop services"
    echo ""

    # Wait for user to stop
    wait
fi

echo "Quick start script complete!"
