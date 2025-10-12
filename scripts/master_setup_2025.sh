#!/bin/bash

################################################################################
# MASTER SETUP SCRIPT - October 2025 AI Game Development Toolchain
# SkillBridge Educational Games Platform
#
# This script orchestrates the complete installation of:
# 1. FLUX.1 + SDXL Lightning (Image Generation)
# 2. Roblox Cube 3D (3D Model Generation)
# 3. Stable Audio Open + Bark (Audio & Voice - Commercial Safe)
# 4. Godot Engine 4 (Game Engine - 100% Free)
#
# ALL TOOLS ARE:
# - 100% Free & Open Source
# - Commercial-friendly licenses
# - No usage limits
# - No royalties or fees
#
# Estimated Total Installation Time: 2-4 hours
# Estimated Total Disk Space: ~80GB
#
# Requirements:
# - NVIDIA GPU with 8GB+ VRAM (RTX 4070 or better)
# - Ubuntu/Debian Linux
# - 100GB free disk space
# - Internet connection
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Log file
LOG_FILE="$HOME/ai-tools-setup.log"

echo ""
echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                                                                ║${NC}"
echo -e "${BOLD}${CYAN}║          SKILLBRIDGE AI GAME DEVELOPMENT SETUP                ║${NC}"
echo -e "${BOLD}${CYAN}║          October 2025 - Latest Open Source Tools              ║${NC}"
echo -e "${BOLD}${CYAN}║                                                                ║${NC}"
echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}This will install the complete AI-powered game development toolchain:${NC}"
echo ""
echo -e "${GREEN}  1. FLUX.1 + SDXL Lightning${NC}   - 2-3x faster image generation"
echo -e "${GREEN}  2. Roblox Cube 3D${NC}            - Text-to-3D model generation"
echo -e "${GREEN}  3. Stable Audio + Bark${NC}       - Sound effects & voice (commercial-safe)"
echo -e "${GREEN}  4. Godot Engine 4${NC}            - Free game engine (Unity alternative)"
echo ""
echo -e "${YELLOW}Estimated Time:${NC} 2-4 hours (mostly downloads)"
echo -e "${YELLOW}Disk Space:${NC} ~80GB"
echo -e "${YELLOW}Commercial Use:${NC} All tools are 100% commercial-safe"
echo ""
echo -e "${BLUE}All progress will be logged to: ${LOG_FILE}${NC}"
echo ""

# Confirmation
read -p "$(echo -e ${BOLD}${YELLOW}Do you want to proceed? [y/N]: ${NC})" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Setup cancelled.${NC}"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "SkillBridge AI Setup Started: $(date)" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

START_TIME=$(date +%s)

################################################################################
# Pre-flight Checks
################################################################################

echo -e "${BOLD}${BLUE}[PREFLIGHT] Running system checks...${NC}" | tee -a "$LOG_FILE"
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}✗ This script is designed for Linux systems only.${NC}" | tee -a "$LOG_FILE"
    exit 1
fi
echo -e "${GREEN}✓ Operating System: Linux${NC}" | tee -a "$LOG_FILE"

# Check NVIDIA GPU
if ! command -v nvidia-smi &> /dev/null; then
    echo -e "${RED}✗ NVIDIA GPU not detected or drivers not installed.${NC}" | tee -a "$LOG_FILE"
    echo -e "${YELLOW}  Please install NVIDIA drivers first:${NC}"
    echo -e "${YELLOW}  sudo ubuntu-drivers autoinstall${NC}"
    exit 1
fi

GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1)
VRAM_MB=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -n 1)
VRAM_GB=$((VRAM_MB / 1024))

echo -e "${GREEN}✓ GPU: $GPU_NAME (${VRAM_GB}GB VRAM)${NC}" | tee -a "$LOG_FILE"

if [ $VRAM_GB -lt 8 ]; then
    echo -e "${YELLOW}⚠ Warning: At least 8GB VRAM recommended. You have ${VRAM_GB}GB.${NC}" | tee -a "$LOG_FILE"
    echo -e "${YELLOW}  Some models may run slowly or require reduced quality settings.${NC}" | tee -a "$LOG_FILE"
fi

# Check disk space
AVAILABLE_GB=$(df -BG "$HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
echo -e "${GREEN}✓ Available disk space: ${AVAILABLE_GB}GB${NC}" | tee -a "$LOG_FILE"

if [ $AVAILABLE_GB -lt 100 ]; then
    echo -e "${RED}✗ Insufficient disk space. Need 100GB, have ${AVAILABLE_GB}GB.${NC}" | tee -a "$LOG_FILE"
    exit 1
fi

# Check internet connectivity
if ! ping -c 1 huggingface.co &> /dev/null; then
    echo -e "${RED}✗ Cannot reach HuggingFace. Check internet connection.${NC}" | tee -a "$LOG_FILE"
    exit 1
fi
echo -e "${GREEN}✓ Internet connection active${NC}" | tee -a "$LOG_FILE"

echo ""
echo -e "${GREEN}✓ All preflight checks passed!${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

################################################################################
# Step 1: FLUX.1 + SDXL Lightning Setup
################################################################################

echo -e "${BOLD}${CYAN}[1/4] Installing FLUX.1 + SDXL Lightning (Image Generation)...${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}      This will take 30-90 minutes and download ~35GB${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ -f "$SCRIPT_DIR/setup_flux_ai.sh" ]; then
    chmod +x "$SCRIPT_DIR/setup_flux_ai.sh"
    bash "$SCRIPT_DIR/setup_flux_ai.sh" 2>&1 | tee -a "$LOG_FILE"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✓ FLUX.1 installation complete${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "${RED}✗ FLUX.1 installation failed. Check $LOG_FILE for details.${NC}" | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo -e "${RED}✗ setup_flux_ai.sh not found in $SCRIPT_DIR${NC}" | tee -a "$LOG_FILE"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

################################################################################
# Step 2: Roblox Cube 3D Setup
################################################################################

echo -e "${BOLD}${CYAN}[2/4] Installing Roblox Cube 3D (3D Model Generation)...${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}      This will take 20-60 minutes and download ~15GB${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ -f "$SCRIPT_DIR/setup_cube3d.sh" ]; then
    chmod +x "$SCRIPT_DIR/setup_cube3d.sh"
    bash "$SCRIPT_DIR/setup_cube3d.sh" 2>&1 | tee -a "$LOG_FILE"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✓ Cube 3D installation complete${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "${RED}✗ Cube 3D installation failed. Check $LOG_FILE for details.${NC}" | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo -e "${RED}✗ setup_cube3d.sh not found in $SCRIPT_DIR${NC}" | tee -a "$LOG_FILE"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

################################################################################
# Step 3: Stable Audio + Bark Setup
################################################################################

echo -e "${BOLD}${CYAN}[3/4] Installing Stable Audio + Bark (Audio & Voice)...${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}      This will take 15-45 minutes and download ~15GB${NC}" | tee -a "$LOG_FILE"
echo -e "${YELLOW}      NOTE: Using only commercial-safe models (no MusicGen)${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ -f "$SCRIPT_DIR/setup_stable_audio.sh" ]; then
    chmod +x "$SCRIPT_DIR/setup_stable_audio.sh"
    bash "$SCRIPT_DIR/setup_stable_audio.sh" 2>&1 | tee -a "$LOG_FILE"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✓ Stable Audio + Bark installation complete${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "${RED}✗ Audio installation failed. Check $LOG_FILE for details.${NC}" | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo -e "${RED}✗ setup_stable_audio.sh not found in $SCRIPT_DIR${NC}" | tee -a "$LOG_FILE"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

################################################################################
# Step 4: Godot Engine Setup
################################################################################

echo -e "${BOLD}${CYAN}[4/4] Installing Godot Engine 4 (Game Engine)...${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}      This will take 5-15 minutes and download ~200MB${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ -f "$SCRIPT_DIR/setup_godot_ai.sh" ]; then
    chmod +x "$SCRIPT_DIR/setup_godot_ai.sh"
    bash "$SCRIPT_DIR/setup_godot_ai.sh" 2>&1 | tee -a "$LOG_FILE"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✓ Godot Engine installation complete${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "${RED}✗ Godot installation failed. Check $LOG_FILE for details.${NC}" | tee -a "$LOG_FILE"
        exit 1
    fi
else
    echo -e "${RED}✗ setup_godot_ai.sh not found in $SCRIPT_DIR${NC}" | tee -a "$LOG_FILE"
    exit 1
fi

echo "" | tee -a "$LOG_FILE"

################################################################################
# Final Summary
################################################################################

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MINUTES=$((DURATION / 60))

echo "" | tee -a "$LOG_FILE"
echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}${GREEN}║                                                                ║${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}${GREEN}║               INSTALLATION COMPLETE!                           ║${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}${GREEN}║                                                                ║${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}INSTALLED TOOLS (All 100% Free & Commercial-Safe)${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}✓ FLUX.1 + SDXL Lightning${NC} (~35GB)" | tee -a "$LOG_FILE"
echo "    • Apache 2.0 license (100% free, commercial OK)"
echo "    • 2-3x faster than Stable Diffusion 1.5"
echo "    • Performance: 2-3 sec per image"
echo "    • Start: bash ~/ai-tools/start_comfyui_flux.sh"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}✓ Roblox Cube 3D${NC} (~15GB)" | tee -a "$LOG_FILE"
echo "    • Open source (commercial OK)"
echo "    • Text-to-3D model generation"
echo "    • Performance: 30-60 sec per simple object"
echo "    • Activate: source ~/ai-tools/cube3d-env/bin/activate"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}✓ Stable Audio Open + Bark${NC} (~15GB)" | tee -a "$LOG_FILE"
echo "    • CC-BY-SA 4.0 + MIT licenses (commercial OK)"
echo "    • Sound effects, music, voice synthesis"
echo "    • Performance: 10-15 sec per audio clip"
echo "    • Activate: source ~/ai-tools/audio-env/bin/activate"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}✓ Godot Engine 4.3${NC} (~200MB)" | tee -a "$LOG_FILE"
echo "    • MIT license (100% free forever, no royalties)"
echo "    • Complete game engine (Unity alternative)"
echo "    • Export to: Windows, Linux, Mac, iOS, Android, Web"
echo "    • Launch: bash ~/launch_godot.sh"
echo "" | tee -a "$LOG_FILE"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}TOTAL DISK SPACE USED:${NC} ~65GB" | tee -a "$LOG_FILE"
echo -e "${BOLD}INSTALLATION TIME:${NC} ${DURATION_MINUTES} minutes" | tee -a "$LOG_FILE"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BOLD}${YELLOW}QUICK START GUIDE${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${CYAN}1. Generate Images:${NC}" | tee -a "$LOG_FILE"
echo "   bash ~/ai-tools/start_comfyui_flux.sh" | tee -a "$LOG_FILE"
echo "   # Access at http://localhost:8188" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${CYAN}2. Generate 3D Models:${NC}" | tee -a "$LOG_FILE"
echo '   source ~/ai-tools/cube3d-env/bin/activate' | tee -a "$LOG_FILE"
echo '   python3 ~/ai-tools/cube3d/generate_3d.py \' | tee -a "$LOG_FILE"
echo '     --prompt "Simple wooden chair" \' | tee -a "$LOG_FILE"
echo '     --output ~/ai-tools/outputs/3d_models/chair.obj' | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${CYAN}3. Generate Audio:${NC}" | tee -a "$LOG_FILE"
echo '   source ~/ai-tools/audio-env/bin/activate' | tee -a "$LOG_FILE"
echo '   python3 ~/ai-tools/stable-audio/generate_audio_unified.py \' | tee -a "$LOG_FILE"
echo '     --type sfx \' | tee -a "$LOG_FILE"
echo '     --prompt "Success chime" \' | tee -a "$LOG_FILE"
echo '     --output ~/ai-tools/outputs/audio/sfx/success.wav' | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${CYAN}4. Start Game Development:${NC}" | tee -a "$LOG_FILE"
echo "   bash ~/launch_godot.sh" | tee -a "$LOG_FILE"
echo "   # Opens SkillBridge project in Godot editor" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo -e "${BOLD}${YELLOW}COST ANALYSIS${NC}" | tee -a "$LOG_FILE"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}Cloud APIs (DALL-E 3, ElevenLabs, Unity):${NC}" | tee -a "$LOG_FILE"
echo "  • Cost per game: \$5-10" | tee -a "$LOG_FILE"
echo "  • Cost for 75 games: \$375-750" | tee -a "$LOG_FILE"
echo "  • Plus Unity fees after \$100k revenue" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${GREEN}Our October 2025 Open Source Stack:${NC}" | tee -a "$LOG_FILE"
echo "  • Cost per game: \$0" | tee -a "$LOG_FILE"
echo "  • Cost for 75 games: \$0" | tee -a "$LOG_FILE"
echo "  • No fees, no royalties, EVER" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BOLD}${GREEN}SAVINGS: \$375-750+ over 3 years${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BOLD}${CYAN}NEXT STEPS:${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "  1. Test each tool with the Quick Start commands above" | tee -a "$LOG_FILE"
echo "  2. Create asset specifications for your first game" | tee -a "$LOG_FILE"
echo "  3. Generate all assets (images, 3D, audio)" | tee -a "$LOG_FILE"
echo "  4. Import assets into Godot project" | tee -a "$LOG_FILE"
echo "  5. Start building SkillBridge games!" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${YELLOW}Full setup log saved to: ${LOG_FILE}${NC}" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "======================================================================" | tee -a "$LOG_FILE"
echo "SkillBridge AI Setup Completed: $(date)" | tee -a "$LOG_FILE"
echo "======================================================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo -e "${BOLD}${GREEN}Happy game development! 🎮${NC}"
echo ""
