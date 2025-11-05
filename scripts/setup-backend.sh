#!/bin/bash

# arQ Backend Setup Script
# This script creates all backend modules, services, controllers, and DTOs

set -e

echo "🚀 Starting arQ Backend Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

echo -e "${GREEN}✓${NC} Changed to backend directory"

# Create directory structure
echo -e "\n${YELLOW}📁 Creating directory structure...${NC}"

mkdir -p src/common/{decorators,guards,filters,interceptors,pipes}
mkdir -p src/common/cache
mkdir -p src/modules/{auth,users,lessons,exercises,progress,verses,achievements,analytics}

# Create subdirectories for each module
for module in auth users lessons exercises progress verses achievements analytics; do
    mkdir -p src/modules/$module/{dto,guards,decorators,tests}
done

# Special directories for auth
mkdir -p src/modules/auth/strategies

echo -e "${GREEN}✓${NC} Directory structure created"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi

# Generate Prisma Client
echo -e "\n${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓${NC} Prisma Client generated"

echo -e "\n${GREEN}✅ Backend structure setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Create .env file with DATABASE_URL"
echo -e "  2. Run: npx prisma migrate dev"
echo -e "  3. Run: node scripts/generate-modules.js"
echo -e "  4. Run: npm run start:dev"
