@echo off
echo.
echo ========================================
echo Brands Dashboard - Quick Setup Script
echo ========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js v18 or higher first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo √ Node.js found: %NODE_VERSION%
echo.

echo Installing backend...
cd backend

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ! Please edit backend\.env with your database credentials
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo X Backend installation failed
    pause
    exit /b 1
)

echo √ Backend setup complete!
echo.

echo Installing frontend...
cd ..\frontend

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo X Frontend installation failed
    pause
    exit /b 1
)

echo √ Frontend setup complete!
echo.

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your PostgreSQL credentials
echo 2. Start the backend: cd backend ^&^& npm start
echo 3. In a new terminal, start the frontend: cd frontend ^&^& npm run dev
echo 4. Open your browser to http://localhost:5173
echo.
echo For more information, see README.md
echo.
pause
