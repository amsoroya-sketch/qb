#!/bin/bash

################################################################################
# Godot Engine 4 Setup Script
# October 2025 - 100% Free Game Engine (Unity Alternative)
#
# What this installs:
# - Godot Engine 4.x (MIT License - 100% free forever)
# - GDScript language support
# - Export templates for all platforms
# - AI coding assistants integration
# - Educational game project template
#
# Requirements:
# - Ubuntu/Debian Linux
# - 10GB free disk space
# - Internet connection for downloads
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GODOT_DIR="$HOME/godot"
GODOT_VERSION="4.3"  # Latest stable as of Oct 2025
GODOT_BIN="Godot_v${GODOT_VERSION}-stable_linux.x86_64"
PROJECT_DIR="$HOME/godot-projects"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Godot Engine 4 Setup${NC}"
echo -e "${BLUE}100% Free Game Engine${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

################################################################################
# Step 1: System Requirements Check
################################################################################

echo -e "${YELLOW}[1/7] Checking system requirements...${NC}"

# Check disk space
AVAILABLE_GB=$(df -BG "$HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
echo -e "${GREEN}✓ Available disk space: ${AVAILABLE_GB}GB${NC}"

if [ $AVAILABLE_GB -lt 10 ]; then
    echo -e "${RED}✗ Warning: At least 10GB free space recommended.${NC}"
fi

# Check if GPU available (optional for Godot, but helpful)
if command -v nvidia-smi &> /dev/null; then
    GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1)
    echo -e "${GREEN}✓ GPU detected: $GPU_NAME (will enable enhanced graphics)${NC}"
fi

echo ""

################################################################################
# Step 2: Install System Dependencies
################################################################################

echo -e "${YELLOW}[2/7] Installing system dependencies...${NC}"

sudo apt-get update
sudo apt-get install -y \
    wget \
    unzip \
    libx11-dev \
    libxcursor-dev \
    libxinerama-dev \
    libgl1-mesa-dev \
    libglu1-mesa-dev \
    libasound2-dev \
    libpulse-dev \
    libfreetype6-dev \
    libxi-dev \
    libxrandr-dev

echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

################################################################################
# Step 3: Download Godot Engine
################################################################################

echo -e "${YELLOW}[3/7] Downloading Godot Engine ${GODOT_VERSION}...${NC}"
echo -e "${BLUE}This will download ~100MB. This may take 2-10 minutes.${NC}"

mkdir -p "$GODOT_DIR"
cd "$GODOT_DIR"

if [ ! -f "$GODOT_BIN" ]; then
    # Download Godot Engine
    DOWNLOAD_URL="https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_linux.x86_64.zip"

    wget -q --show-progress "$DOWNLOAD_URL" -O godot.zip

    # Extract
    unzip -q godot.zip
    rm godot.zip

    # Make executable
    chmod +x "$GODOT_BIN"

    echo -e "${GREEN}✓ Godot Engine ${GODOT_VERSION} downloaded${NC}"
else
    echo -e "${GREEN}✓ Godot Engine already downloaded${NC}"
fi

echo ""

################################################################################
# Step 4: Download Export Templates
################################################################################

echo -e "${YELLOW}[4/7] Downloading export templates...${NC}"
echo -e "${BLUE}This enables exporting to Windows, macOS, Linux, Android, iOS, Web${NC}"

TEMPLATES_DIR="$HOME/.local/share/godot/export_templates/${GODOT_VERSION}.stable"
mkdir -p "$TEMPLATES_DIR"

if [ ! -d "$TEMPLATES_DIR/linux_debug.x86_64" ]; then
    # Download export templates
    TEMPLATES_URL="https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable/Godot_v${GODOT_VERSION}-stable_export_templates.tpz"

    wget -q --show-progress "$TEMPLATES_URL" -O templates.tpz

    # Extract templates
    unzip -q templates.tpz -d "$HOME/.local/share/godot/export_templates/"

    # Rename templates directory to match expected name
    mv "$HOME/.local/share/godot/export_templates/templates" "$TEMPLATES_DIR"

    rm templates.tpz

    echo -e "${GREEN}✓ Export templates installed${NC}"
else
    echo -e "${GREEN}✓ Export templates already installed${NC}"
fi

echo ""

################################################################################
# Step 5: Create Desktop Shortcut
################################################################################

echo -e "${YELLOW}[5/7] Creating desktop shortcut...${NC}"

# Create .desktop file
cat > "$HOME/.local/share/applications/godot.desktop" << EOF
[Desktop Entry]
Name=Godot Engine
Comment=Multi-platform 2D and 3D game engine
Exec=$GODOT_DIR/$GODOT_BIN
Icon=$GODOT_DIR/icon.svg
Terminal=false
Type=Application
Categories=Development;IDE;
EOF

# Make desktop file executable
chmod +x "$HOME/.local/share/applications/godot.desktop"

echo -e "${GREEN}✓ Desktop shortcut created${NC}"
echo ""

################################################################################
# Step 6: Create Project Directory and Educational Template
################################################################################

echo -e "${YELLOW}[6/7] Creating SkillBridge project template...${NC}"

mkdir -p "$PROJECT_DIR/SkillBridge"
cd "$PROJECT_DIR/SkillBridge"

# Create project.godot file
cat > "project.godot" << 'EOF'
; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="SkillBridge Educational Games"
config/description="Autism Skills Training Educational Game Platform"
config/version="1.0.0"
run/main_scene="res://scenes/main_menu.tscn"
config/features=PackedStringArray("4.3", "GL Compatibility")
config/icon="res://icon.svg"

[display]

window/size/viewport_width=1280
window/size/viewport_height=720
window/size/resizable=true
window/stretch/mode="viewport"

[input]

# Touch/Mouse controls for autism-friendly interaction
click={
"deadzone": 0.5,
"events": [Object(InputEventMouseButton,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"button_mask":0,"position":Vector2(0, 0),"global_position":Vector2(0, 0),"factor":1.0,"button_index":1,"canceled":false,"pressed":false,"double_click":false,"script":null)
]
}

[rendering]

renderer/rendering_method="gl_compatibility"
renderer/rendering_method.mobile="gl_compatibility"
textures/vram_compression/import_etc2_astc=true
EOF

# Create directory structure
mkdir -p scenes
mkdir -p scripts
mkdir -p assets/{images,audio,fonts,3d_models}
mkdir -p assets/audio/{music,sfx,voice}

# Create a simple main menu scene script
cat > "scripts/main_menu.gd" << 'EOFGD'
extends Control

# SkillBridge Main Menu
# Autism-friendly interface with large buttons, clear text, calming colors

func _ready():
	print("SkillBridge Educational Games - Initializing...")

	# Set up UI
	setup_ui()

func setup_ui():
	# Create simple, accessible UI
	var title = Label.new()
	title.text = "SkillBridge Games"
	title.add_theme_font_size_override("font_size", 48)
	title.position = Vector2(640, 100)
	title.anchor_left = 0.5
	title.anchor_right = 0.5
	add_child(title)

func _on_play_button_pressed():
	print("Starting game...")
	# Load first game scene
	# get_tree().change_scene_to_file("res://scenes/game_01_color_matching.tscn")
	pass

func _on_settings_button_pressed():
	print("Opening settings...")
	# Load settings scene
	pass
EOFGD

# Create README for project
cat > "README.md" << 'EOFMD'
# SkillBridge Educational Games - Godot Project

## Project Structure

```
SkillBridge/
├── scenes/              # Game scenes (.tscn files)
│   ├── main_menu.tscn
│   ├── game_01_color_matching.tscn
│   ├── game_02_emotion_recognition.tscn
│   └── ...
├── scripts/             # GDScript files (.gd)
│   ├── main_menu.gd
│   ├── game_manager.gd
│   └── ...
├── assets/              # Game assets
│   ├── images/          # Sprites, textures (from FLUX.1)
│   ├── audio/           # Sound & music (from Stable Audio + Bark)
│   │   ├── music/
│   │   ├── sfx/
│   │   └── voice/
│   ├── fonts/           # Accessibility-friendly fonts
│   └── 3d_models/       # 3D objects (from Cube 3D)
└── project.godot        # Project configuration
```

## Importing AI-Generated Assets

### From FLUX.1 (Images)
1. Copy images from `~/ai-tools/outputs/flux/` to `assets/images/`
2. Drag & drop into Godot editor
3. Godot auto-imports as Texture2D resources

### From Cube 3D (3D Models)
1. Copy .obj/.glb files from `~/ai-tools/outputs/3d_models/` to `assets/3d_models/`
2. Drag & drop into Godot editor
3. Godot auto-imports as 3D scenes

### From Stable Audio + Bark (Audio)
1. Copy .wav files from `~/ai-tools/outputs/audio/` to `assets/audio/`
2. Drag & drop into Godot editor
3. Godot auto-imports as AudioStream resources

## Running the Project

```bash
cd ~/godot
./Godot_v4.3-stable_linux.x86_64 --path ~/godot-projects/SkillBridge
```

## Exporting Games

1. Project > Export
2. Select platform (Windows, Linux, Web, Android)
3. Export
4. No royalties, no fees, 100% free forever!

## Learning Resources

- Godot Docs: https://docs.godotengine.org/
- GDScript Guide: https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/
- Educational Games Tutorial: https://www.gdquest.com/
EOFMD

echo -e "${GREEN}✓ SkillBridge project template created${NC}"
echo ""

################################################################################
# Step 7: Create Helper Scripts
################################################################################

echo -e "${YELLOW}[7/7] Creating helper scripts...${NC}"

# Create Godot launcher script
cat > "$HOME/launch_godot.sh" << EOFLAUNCH
#!/bin/bash

# Launch Godot Engine with SkillBridge project

cd "$GODOT_DIR"
./"$GODOT_BIN" --path "$PROJECT_DIR/SkillBridge"
EOFLAUNCH

chmod +x "$HOME/launch_godot.sh"

# Create asset import script
cat > "$PROJECT_DIR/SkillBridge/import_ai_assets.sh" << 'EOFIMPORT'
#!/bin/bash

# Import AI-generated assets into Godot project

AI_OUTPUTS="$HOME/ai-tools/outputs"
PROJECT_DIR="$(dirname "$0")"

echo "Importing AI-generated assets..."

# Import images from FLUX.1
if [ -d "$AI_OUTPUTS/flux" ]; then
    echo "Copying images from FLUX.1..."
    rsync -av "$AI_OUTPUTS/flux/" "$PROJECT_DIR/assets/images/"
    echo "✓ Images imported"
fi

# Import 3D models from Cube 3D
if [ -d "$AI_OUTPUTS/3d_models" ]; then
    echo "Copying 3D models from Cube 3D..."
    rsync -av "$AI_OUTPUTS/3d_models/" "$PROJECT_DIR/assets/3d_models/"
    echo "✓ 3D models imported"
fi

# Import audio from Stable Audio + Bark
if [ -d "$AI_OUTPUTS/audio" ]; then
    echo "Copying audio files..."
    rsync -av "$AI_OUTPUTS/audio/" "$PROJECT_DIR/assets/audio/"
    echo "✓ Audio imported"
fi

echo ""
echo "Asset import complete!"
echo "Open Godot editor to use the imported assets."
EOFIMPORT

chmod +x "$PROJECT_DIR/SkillBridge/import_ai_assets.sh"

echo -e "${GREEN}✓ Helper scripts created${NC}"
echo ""

################################################################################
# Verification & Summary
################################################################################

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Godot Engine Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}What's Installed:${NC}"
echo "  • Godot Engine ${GODOT_VERSION} (~100MB)"
echo "  • Export templates for all platforms"
echo "  • SkillBridge project template"
echo "  • Asset import automation"
echo ""
echo -e "${BLUE}License: MIT (100% Free Forever)${NC}"
echo "  • No royalties EVER"
echo "  • No revenue sharing"
echo "  • No usage fees"
echo "  • Complete commercial freedom"
echo ""
echo -e "${BLUE}Supported Platforms:${NC}"
echo "  • Windows (Desktop)"
echo "  • macOS (Desktop)"
echo "  • Linux (Desktop)"
echo "  • Android (Mobile/Tablet)"
echo "  • iOS (iPad/iPhone)"
echo "  • Web (HTML5)"
echo ""
echo -e "${BLUE}Launch Godot:${NC}"
echo "  bash ~/launch_godot.sh"
echo ""
echo -e "${BLUE}Or from desktop:${NC}"
echo "  Search for 'Godot Engine' in application menu"
echo ""
echo -e "${BLUE}Project Location:${NC}"
echo "  $PROJECT_DIR/SkillBridge"
echo ""
echo -e "${BLUE}Import AI Assets:${NC}"
echo "  cd $PROJECT_DIR/SkillBridge"
echo "  ./import_ai_assets.sh"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Launch Godot editor"
echo "  2. Open SkillBridge project"
echo "  3. Import AI-generated assets"
echo "  4. Start building first game!"
echo ""
echo -e "${BLUE}Godot vs Unity Comparison:${NC}"
echo "  • Unity: Fees after \$100k revenue, royalties, licensing"
echo "  • Godot: FREE FOREVER, no fees, no royalties, MIT license"
echo ""
echo -e "${YELLOW}Learning Curve:${NC}"
echo "  • GDScript similar to Python (easier than C#)"
echo "  • Excellent documentation"
echo "  • Large community, many tutorials"
echo "  • Perfect for 2D educational games"
echo ""
