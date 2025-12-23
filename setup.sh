#!/bin/bash

echo "================================"
echo "Brands Dashboard Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

echo "Installing frontend dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Instructions
echo "================================"
echo "Setup Complete! 🎉"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your database credentials in backend/.env"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open your browser to http://localhost:5173"
echo ""
echo "================================"
