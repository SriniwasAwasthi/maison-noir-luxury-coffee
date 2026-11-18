@echo off
setlocal enabledelayedexpansion

title Maison Noir - Haute Specialty Roastery

echo ========================================================
echo  MAISON NOIR - HAUTE SPECIALTY ROASTERY ^& SANCTUARY
echo ========================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js (v18.0.0 or higher) from:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Check for npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found in your system PATH.
    echo Please ensure npm is installed alongside Node.js.
    echo.
    pause
    exit /b 1
)

:: 3. Setup .env from .env.example if missing
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [INFO] Created .env from .env.example (configured with local mock fallbacks).
    )
)

:: 4. Check dependencies (node_modules)
if not exist "node_modules\" (
    echo [INFO] First time launch detected. Installing dependencies via npm install...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [INFO] Dependencies installed successfully.
)

:: 5. Launch Development Server
echo.
echo [INFO] Launching Maison Noir Luxury Web Platform...
echo [INFO] Local server will open at http://localhost:5173
echo.
call npm run dev
