#!/bin/bash

# arQ Mobile Setup Script
# Initializes React Native (Expo) mobile app

set -e

echo "🚀 Starting arQ Mobile Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")/.."

echo -e "${GREEN}✓${NC} Changed to project root"

# Create mobile app with Expo
if [ ! -d "mobile" ]; then
    echo -e "\n${YELLOW}📦 Creating Expo project...${NC}"
    npx create-expo-app@latest mobile \
        --template blank-typescript
    echo -e "${GREEN}✓${NC} Expo project created"
else
    echo -e "${GREEN}✓${NC} Mobile directory already exists"
fi

cd mobile

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"

npm install \
    @react-navigation/native \
    @react-navigation/bottom-tabs \
    @react-navigation/native-stack \
    expo-router \
    zustand \
    axios \
    @tanstack/react-query \
    expo-secure-store \
    expo-font \
    @expo-google-fonts/inter \
    react-native-safe-area-context \
    react-native-screens

npm install -D \
    @types/react \
    @types/react-native

echo -e "${GREEN}✓${NC} Dependencies installed"

# Create directory structure
echo -e "\n${YELLOW}📁 Creating directory structure...${NC}"

mkdir -p src/{screens,components,navigation,services,stores,utils,types}
mkdir -p src/screens/{Auth,Dashboard,Lessons,Exercises,Progress,Profile}
mkdir -p src/components/{common,features}
mkdir -p assets/{images,fonts}

echo -e "${GREEN}✓${NC} Directory structure created"

# Create app.json configuration
cat > app.json << 'EOF'
{
  "expo": {
    "name": "arQ",
    "slug": "arq",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.arq.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.arq.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "apiUrl": "http://localhost:3001/api/v1"
    }
  }
}
EOF

echo -e "${GREEN}✓${NC} app.json configured"

echo -e "\n${GREEN}✅ Mobile setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Run: node ../scripts/generate-mobile.js"
echo -e "  2. Update app.json with your API URL"
echo -e "  3. Run: npm start"
echo -e "  4. Scan QR code with Expo Go app"
