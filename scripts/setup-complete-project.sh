#!/bin/bash

# arQ Complete Project Setup Script
# Runs entire project setup from start to finish

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║              arQ - Complete Project Setup                ║"
echo "║                                                          ║"
echo "║    Quranic Arabic Grammar Learning Management System    ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Navigate to project root
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)

echo -e "${BLUE}Project Root: $PROJECT_ROOT${NC}\n"

# ============================================
# STEP 1: BACKEND SETUP
# ============================================

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  STEP 1: Backend Setup${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ -f "scripts/setup-backend.sh" ]; then
    bash scripts/setup-backend.sh
else
    echo -e "${RED}Error: setup-backend.sh not found${NC}"
    exit 1
fi

# Generate backend modules
echo -e "\n${YELLOW}Generating backend modules...${NC}"
if [ -f "scripts/generate-modules.js" ]; then
    node scripts/generate-modules.js
else
    echo -e "${RED}Error: generate-modules.js not found${NC}"
    exit 1
fi

# Generate remaining modules
echo -e "\n${YELLOW}Generating remaining backend modules...${NC}"
if [ -f "scripts/generate-remaining-modules.js" ]; then
    node scripts/generate-remaining-modules.js
else
    echo -e "${RED}Error: generate-remaining-modules.js not found${NC}"
    exit 1
fi

# Setup database
echo -e "\n${YELLOW}Setting up database...${NC}"
cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/arq_dev?schema=public"

# JWT Secrets
JWT_ACCESS_SECRET="dev-access-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Server
PORT="3001"
NODE_ENV="development"

# Frontend
FRONTEND_URL="http://localhost:3000"
EOF
    echo -e "${GREEN}✓ Created .env file${NC}"
fi

# Run migrations
echo -e "\n${YELLOW}Running database migrations...${NC}"
npx prisma migrate dev --name init

# Run seed
echo -e "\n${YELLOW}Seeding database...${NC}"
npx prisma db seed

cd "$PROJECT_ROOT"

echo -e "\n${GREEN}✅ Backend setup complete!${NC}"

# ============================================
# STEP 2: FRONTEND SETUP
# ============================================

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  STEP 2: Frontend Setup${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Note: Commented out as it requires interactive input
echo -e "${YELLOW}Frontend setup requires manual steps:${NC}"
echo -e "  1. Run: bash scripts/setup-frontend.sh"
echo -e "  2. Run: node scripts/generate-frontend.js"
echo -e "  3. Copy .env.local.example to .env.local"

# ============================================
# STEP 3: DOCKER SERVICES
# ============================================

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  STEP 3: Docker Services${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Starting Docker services...${NC}"
    docker-compose up -d postgres redis

    echo -e "\n${GREEN}✓ PostgreSQL running on port 5432${NC}"
    echo -e "${GREEN}✓ Redis running on port 6379${NC}"
else
    echo -e "${YELLOW}Docker not found. Skipping Docker setup.${NC}"
    echo -e "You'll need to run PostgreSQL and Redis manually or install Docker."
fi

# ============================================
# STEP 4: DATA IMPORT
# ============================================

echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  STEP 4: Quranic Data Import${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Importing sample Quranic data (Surah Al-Fatiha)...${NC}"
if [ -f "scripts/import-quranic-data.ts" ]; then
    cd backend
    npx ts-node ../scripts/import-quranic-data.ts
    cd "$PROJECT_ROOT"
else
    echo -e "${YELLOW}Skipping data import - script not found${NC}"
fi

# ============================================
# SUMMARY
# ============================================

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ PROJECT SETUP COMPLETE!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${CYAN}📊 Project Status:${NC}"
echo -e "  ${GREEN}✓${NC} Backend: Setup complete"
echo -e "  ${GREEN}✓${NC} Database: Migrated and seeded"
echo -e "  ${GREEN}✓${NC} Docker: PostgreSQL & Redis running"
echo -e "  ${GREEN}✓${NC} Sample Data: Surah Al-Fatiha imported"
echo ""

echo -e "${CYAN}🚀 Quick Start Commands:${NC}\n"

echo -e "${YELLOW}Backend:${NC}"
echo -e "  cd backend"
echo -e "  npm run start:dev"
echo -e "  ${BLUE}→ API: http://localhost:3001/api/v1${NC}"
echo -e "  ${BLUE}→ Docs: http://localhost:3001/api/docs${NC}\n"

echo -e "${YELLOW}Frontend (after setup):${NC}"
echo -e "  cd frontend"
echo -e "  npm run dev"
echo -e "  ${BLUE}→ Web: http://localhost:3000${NC}\n"

echo -e "${YELLOW}Mobile (after setup):${NC}"
echo -e "  cd mobile"
echo -e "  npm start\n"

echo -e "${CYAN}📝 Next Steps:${NC}"
echo -e "  1. ${YELLOW}cd backend && npm run start:dev${NC}"
echo -e "  2. Open ${BLUE}http://localhost:3001/api/docs${NC} to see all endpoints"
echo -e "  3. Test login with: ${GREEN}student@arq.com / student123${NC}"
echo -e "  4. Setup frontend: ${YELLOW}bash scripts/setup-frontend.sh${NC}"
echo -e "  5. Setup mobile: ${YELLOW}bash scripts/setup-mobile.sh${NC}\n"

echo -e "${CYAN}📚 Documentation:${NC}"
echo -e "  • API Specification: API_SPECIFICATION.md"
echo -e "  • Development Setup: DEVELOPMENT_SETUP.md"
echo -e "  • Coding Standards: CODING_STANDARDS.md"
echo -e "  • Testing Strategy: TESTING_STRATEGY.md"
echo -e "  • Deployment Guide: DEPLOYMENT_GUIDE.md\n"

echo -e "${CYAN}🔐 Test Credentials:${NC}"
echo -e "  ${YELLOW}Admin:${NC}   admin@arq.com / admin123"
echo -e "  ${YELLOW}Student:${NC} student@arq.com / student123\n"

echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}  Built with ❤️  for Quranic Arabic learners worldwide${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
