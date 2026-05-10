@echo off
REM Cosmic Sudoku - Automated Setup Script for Windows
REM This script will guide you through the setup process

echo ========================================
echo 🚀 COSMIC SUDOKU - AUTOMATED SETUP
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local not found!
    echo Please create .env.local with your Supabase credentials
    pause
    exit /b 1
)

echo ✅ .env.local found
echo.

REM Check if npm dependencies are installed
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
    echo.
)

echo ========================================
echo ⚠️  IMPORTANT: SQL MIGRATIONS NEEDED
echo ========================================
echo.
echo You need to run SQL migrations manually:
echo.
echo 1. Open: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new
echo.
echo 2. Run these files in order:
echo    - supabase/schema.sql
echo    - supabase/currency-functions.sql
echo    - supabase/functions.sql
echo.
echo 3. Copy and paste each file's content into SQL Editor
echo 4. Click "Run" for each file
echo.
echo ========================================
echo.
echo Press any key to start the dev server...
pause >nul

echo.
echo 🚀 Starting development server...
echo.
echo The game will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
