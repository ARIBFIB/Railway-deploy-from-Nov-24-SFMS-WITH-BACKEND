@echo off
echo 🚀 Setting up Foundation Management System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

cd ..

echo ✅ Dependencies installed successfully!

REM Check for environment files
if not exist ".env" (
    echo ⚠️  Frontend .env file not found. Please create it using SETUP.md as reference.
)

if not exist "server\.env" (
    echo ⚠️  Backend .env file not found. Please create it using SETUP.md as reference.
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Create .env files (see SETUP.md for details)
echo 2. Set up your Supabase project and database
echo 3. Run 'npm run dev:full' to start both frontend and backend
echo.
echo 📚 For detailed setup instructions, see README.md and SETUP.md
pause
