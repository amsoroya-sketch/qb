#!/bin/bash

# arQ Frontend Setup Script
# This script initializes Next.js 14 frontend with all configuration

set -e

echo "🚀 Starting arQ Frontend Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${GREEN}✓${NC} Changed to project root"

# Create frontend directory if it doesn't exist
if [ ! -d "frontend" ]; then
    echo -e "\n${YELLOW}📦 Creating Next.js 14 project...${NC}"
    npx create-next-app@latest frontend \
        --typescript \
        --tailwind \
        --app \
        --no-src-dir \
        --import-alias "@/*" \
        --use-npm
    echo -e "${GREEN}✓${NC} Next.js project created"
else
    echo -e "${GREEN}✓${NC} Frontend directory already exists"
fi

cd frontend

# Install additional dependencies
echo -e "\n${YELLOW}📦 Installing additional dependencies...${NC}"

npm install \
    zustand \
    axios \
    @tanstack/react-query \
    react-hook-form \
    zod \
    @hookform/resolvers \
    clsx \
    tailwind-merge \
    lucide-react \
    date-fns

npm install -D \
    @types/node \
    eslint-config-prettier \
    prettier

echo -e "${GREEN}✓${NC} Dependencies installed"

# Create directory structure
echo -e "\n${YELLOW}📁 Creating directory structure...${NC}"

mkdir -p app/{auth,dashboard,lessons,exercises,progress,verses,profile}/{login,register}
mkdir -p components/{ui,layout,features/{auth,lessons,exercises,progress,verses,achievements}}
mkdir -p lib/{api,stores,hooks,utils}
mkdir -p types
mkdir -p public/{images,icons}

echo -e "${GREEN}✓${NC} Directory structure created"

# Create Shadcn/ui configuration
echo -e "\n${YELLOW}🎨 Setting up Shadcn/ui...${NC}"

npx shadcn-ui@latest init -y

# Install common Shadcn components
npx shadcn-ui@latest add button card input label form dialog dropdown-menu separator toast tabs

echo -e "${GREEN}✓${NC} Shadcn/ui components added"

echo -e "\n${GREEN}✅ Frontend setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Run: node ../scripts/generate-frontend.js"
echo -e "  2. Create .env.local with NEXT_PUBLIC_API_URL"
echo -e "  3. Run: npm run dev"
echo -e "  4. Visit: http://localhost:3000"
