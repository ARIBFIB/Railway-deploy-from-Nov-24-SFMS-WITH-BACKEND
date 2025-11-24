#!/bin/bash

echo "🚀 Setting up Foundation Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo "✅ Dependencies installed successfully!"

# Check for environment files
if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found. Please create it using SETUP.md as reference."
fi

if [ ! -f "server/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create it using SETUP.md as reference."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create .env files (see SETUP.md for details)"
echo "2. Set up your Supabase project and database"
echo "3. Run 'npm run dev:full' to start both frontend and backend"
echo ""
echo "📚 For detailed setup instructions, see README.md and SETUP.md"
