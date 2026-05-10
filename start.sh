#!/bin/bash

# Cosmic Sudoku - Automated Setup Script
# This script will guide you through the setup process

echo "🚀 COSMIC SUDOKU - AUTOMATED SETUP"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local not found!${NC}"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

echo -e "${GREEN}✅ .env.local found${NC}"
echo ""

# Check if npm dependencies are installed
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Start dev server
echo -e "${YELLOW}🚀 Starting development server...${NC}"
echo ""
echo "The game will open at: http://localhost:3000"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: You still need to run SQL migrations manually:${NC}"
echo ""
echo "1. Open: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new"
echo "2. Run these files in order:"
echo "   - supabase/schema.sql"
echo "   - supabase/currency-functions.sql"
echo "   - supabase/functions.sql"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
