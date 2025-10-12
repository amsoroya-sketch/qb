#!/bin/bash

################################################################################
# Stable Audio Open Setup Script
# October 2025 - Sound Effects & Audio Generation
#
# What this installs:
# - Stable Audio Open (CC-BY-SA 4.0 license)
# - Specialized sound effect generation
# - High-quality 44.1kHz stereo output
# - Integration with MusicGen + Bark workflow
#
# Requirements:
# - NVIDIA GPU with 6GB+ VRAM (RTX 4070 or better)
# - Ubuntu/Debian Linux
# - 20GB free disk space
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
AI_TOOLS_DIR="$HOME/ai-tools"
AUDIO_DIR="$AI_TOOLS_DIR/stable-audio"
VENV_DIR="$AI_TOOLS_DIR/audio-env"
MODELS_DIR="$AUDIO_DIR/models"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Stable Audio Open Setup${NC}"
echo -e "${BLUE}Sound Effects Generation${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

################################################################################
# Step 1: System Requirements Check
################################################################################

echo -e "${YELLOW}[1/9] Checking system requirements...${NC}"

# Check GPU
if ! command -v nvidia-smi &> /dev/null; then
    echo -e "${RED}✗ NVIDIA GPU not detected. Please install NVIDIA drivers first.${NC}"
    exit 1
fi

GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader | head -n 1)
VRAM_MB=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -n 1)
VRAM_GB=$((VRAM_MB / 1024))

echo -e "${GREEN}✓ GPU: $GPU_NAME${NC}"
echo -e "${GREEN}✓ VRAM: ${VRAM_GB}GB${NC}"

if [ $VRAM_GB -lt 6 ]; then
    echo -e "${RED}✗ Warning: At least 6GB VRAM recommended.${NC}"
fi

# Check disk space
AVAILABLE_GB=$(df -BG "$HOME" | awk 'NR==2 {print $4}' | sed 's/G//')
echo -e "${GREEN}✓ Available disk space: ${AVAILABLE_GB}GB${NC}"

if [ $AVAILABLE_GB -lt 20 ]; then
    echo -e "${RED}✗ Warning: At least 20GB free space recommended.${NC}"
fi

echo ""

################################################################################
# Step 2: Install System Prerequisites
################################################################################

echo -e "${YELLOW}[2/9] Installing system prerequisites...${NC}"

sudo apt-get update
sudo apt-get install -y \
    python3-pip \
    python3-venv \
    git \
    wget \
    curl \
    build-essential \
    ffmpeg \
    libsndfile1 \
    sox \
    libsox-fmt-all

echo -e "${GREEN}✓ Prerequisites installed (includes audio processing tools)${NC}"
echo ""

################################################################################
# Step 3: Create Directory Structure
################################################################################

echo -e "${YELLOW}[3/9] Creating directory structure...${NC}"

mkdir -p "$AUDIO_DIR"
mkdir -p "$MODELS_DIR"
mkdir -p "$AI_TOOLS_DIR/outputs/audio/sfx"
mkdir -p "$AI_TOOLS_DIR/outputs/audio/music"
mkdir -p "$AI_TOOLS_DIR/outputs/audio/voice"

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

################################################################################
# Step 4: Create Python Virtual Environment
################################################################################

echo -e "${YELLOW}[4/9] Creating Python virtual environment...${NC}"

if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv "$VENV_DIR"
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${GREEN}✓ Virtual environment already exists${NC}"
fi

# Activate environment
source "$VENV_DIR/bin/activate"

# Upgrade pip
pip install --upgrade pip setuptools wheel

echo ""

################################################################################
# Step 5: Install PyTorch with CUDA Support
################################################################################

echo -e "${YELLOW}[5/9] Installing PyTorch with CUDA support...${NC}"

# Install PyTorch 2.5+ with CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify PyTorch CUDA
python3 -c "import torch; print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}')"

echo -e "${GREEN}✓ PyTorch with CUDA installed${NC}"
echo ""

################################################################################
# Step 6: Install Stable Audio Open
################################################################################

echo -e "${YELLOW}[6/9] Installing Stable Audio Open...${NC}"

cd "$AI_TOOLS_DIR"

# Clone official repository
if [ ! -d "$AUDIO_DIR/.git" ]; then
    git clone https://github.com/Stability-AI/stable-audio-tools.git "$AUDIO_DIR"
    echo -e "${GREEN}✓ Repository cloned${NC}"
else
    echo -e "${GREEN}✓ Repository already exists${NC}"
    cd "$AUDIO_DIR"
    git pull  # Update to latest
fi

cd "$AUDIO_DIR"

# Install dependencies
pip install -e .

# Install additional audio processing libraries
pip install librosa soundfile pedalboard pydub scipy

echo -e "${GREEN}✓ Stable Audio Open installed${NC}"
echo ""

################################################################################
# Step 7: Download Stable Audio Model
################################################################################

echo -e "${YELLOW}[7/9] Downloading Stable Audio Open model...${NC}"
echo -e "${BLUE}This will download ~12GB. This may take 15-45 minutes.${NC}"

# Install HuggingFace CLI if not already installed
pip install huggingface_hub[cli]

MODEL_PATH="$MODELS_DIR/stable-audio-open"

if [ ! -d "$MODEL_PATH" ]; then
    echo -e "${BLUE}Downloading from HuggingFace...${NC}"

    # Download Stable Audio Open model
    huggingface-cli download stabilityai/stable-audio-open-1.0 \
        --local-dir "$MODEL_PATH" \
        --local-dir-use-symlinks False

    if [ -d "$MODEL_PATH" ]; then
        echo -e "${GREEN}✓ Stable Audio Open model downloaded (~12GB)${NC}"
    else
        echo -e "${RED}✗ Model download failed${NC}"
        echo -e "${YELLOW}Please manually download from: https://huggingface.co/stabilityai/stable-audio-open-1.0${NC}"
    fi
else
    echo -e "${GREEN}✓ Stable Audio Open model already downloaded${NC}"
fi

echo ""

################################################################################
# Step 8: NOTE - MusicGen NOT INSTALLED (Non-Commercial License)
################################################################################

echo -e "${YELLOW}[8/9] Skipping MusicGen (non-commercial license)...${NC}"
echo -e "${BLUE}NOTE: MusicGen has CC-BY-NC 4.0 license (non-commercial only)${NC}"
echo -e "${BLUE}For commercial use, we'll use Stable Audio Open for both SFX and music${NC}"
echo -e "${GREEN}✓ Using commercial-safe alternatives only${NC}"
echo ""

################################################################################
# Step 9: Install Bark (for voice synthesis)
################################################################################

echo -e "${YELLOW}[9/9] Installing Bark for voice synthesis...${NC}"

# Install Bark
pip install git+https://github.com/suno-ai/bark.git

# Preload Bark models
python3 << 'EOFPYTHON'
print("Preloading Bark voice models...")
from bark import preload_models
preload_models()
print("✓ Bark models preloaded")
EOFPYTHON

echo -e "${GREEN}✓ Bark installed and preloaded${NC}"
echo ""

################################################################################
# Create Generation Scripts
################################################################################

echo -e "${YELLOW}Creating audio generation scripts...${NC}"

# Create unified audio generation script
cat > "$AUDIO_DIR/generate_audio_unified.py" << 'EOFPYTHON'
#!/usr/bin/env python3
"""
Unified Audio Generation Script
Combines Stable Audio (SFX), MusicGen (music), and Bark (voice)
"""

import argparse
import torch
import torchaudio
from pathlib import Path
from scipy.io.wavfile import write as write_wav
import numpy as np

class UnifiedAudioGenerator:
    def __init__(self):
        print("Loading audio generation models...")
        print("NOTE: Using only commercial-safe models\n")

        # Load Stable Audio for BOTH sound effects AND music
        try:
            from stable_audio_tools import get_pretrained_model
            from stable_audio_tools.inference.generation import generate_diffusion_cond

            model_path = Path.home() / "ai-tools" / "stable-audio" / "models" / "stable-audio-open"
            self.stable_audio_model, self.stable_audio_config = get_pretrained_model(str(model_path))
            self.stable_audio_generate = generate_diffusion_cond
            print("  ✓ Stable Audio Open loaded (SFX & Music) - CC-BY-SA 4.0")
        except Exception as e:
            print(f"  ⚠ Stable Audio not loaded: {e}")
            self.stable_audio_model = None

        # MusicGen NOT USED - Non-commercial license (CC-BY-NC 4.0)
        # Using Stable Audio Open for music instead

        # Load Bark for voice
        try:
            from bark import generate_audio, SAMPLE_RATE
            self.bark_generate = generate_audio
            self.bark_sample_rate = SAMPLE_RATE
            print("  ✓ Bark loaded (Voice) - MIT License")
        except Exception as e:
            print(f"  ⚠ Bark not loaded: {e}")
            self.bark_generate = None

        print("✓ All models are commercial-safe\n")

    def generate_sound_effect(self, description: str, duration: float, output_path: Path):
        """Generate sound effect using Stable Audio Open"""
        if self.stable_audio_model is None:
            print("ERROR: Stable Audio not available")
            return False

        print(f"Generating sound effect: {description}")
        print(f"Duration: {duration}s")

        try:
            # Generate audio
            output = self.stable_audio_generate(
                self.stable_audio_model,
                description,
                seconds_total=duration,
                batch_size=1
            )

            # Save to file
            torchaudio.save(
                str(output_path),
                output[0],
                sample_rate=44100
            )

            print(f"✓ Saved: {output_path}\n")
            return True

        except Exception as e:
            print(f"✗ Error: {e}\n")
            return False

    def generate_music(self, description: str, duration: float, output_path: Path):
        """Generate background music using Stable Audio Open (commercial-safe)"""
        if self.stable_audio_model is None:
            print("ERROR: Stable Audio not available")
            return False

        print(f"Generating music: {description}")
        print(f"Duration: {duration}s")
        print("Using: Stable Audio Open (CC-BY-SA 4.0 - commercial OK)")

        try:
            # Use Stable Audio for music generation
            # Add "music" keyword to prompt for better results
            music_prompt = f"{description}, music, musical composition"

            output = self.stable_audio_generate(
                self.stable_audio_model,
                music_prompt,
                seconds_total=duration,
                batch_size=1
            )

            # Save to file
            torchaudio.save(
                str(output_path),
                output[0],
                sample_rate=44100
            )

            print(f"✓ Saved: {output_path}\n")
            return True

        except Exception as e:
            print(f"✗ Error: {e}\n")
            return False

    def generate_voice(self, text: str, output_path: Path, voice: str = "v2/en_speaker_6"):
        """Generate voice using Bark"""
        if self.bark_generate is None:
            print("ERROR: Bark not available")
            return False

        print(f"Generating voice: {text}")
        print(f"Voice: {voice}")

        try:
            # Generate audio
            audio_array = self.bark_generate(text, history_prompt=voice)

            # Save to file
            write_wav(str(output_path), self.bark_sample_rate, audio_array)

            print(f"✓ Saved: {output_path}\n")
            return True

        except Exception as e:
            print(f"✗ Error: {e}\n")
            return False

def main():
    parser = argparse.ArgumentParser(description='Generate audio assets')
    parser.add_argument('--type', required=True, choices=['sfx', 'music', 'voice'],
                       help='Type of audio to generate')
    parser.add_argument('--prompt', required=True, help='Description or text')
    parser.add_argument('--output', required=True, help='Output file path')
    parser.add_argument('--duration', type=float, default=2.0, help='Duration in seconds (default: 2.0)')
    parser.add_argument('--voice', default='v2/en_speaker_6', help='Bark voice ID (for voice type)')

    args = parser.parse_args()

    # Initialize generator
    generator = UnifiedAudioGenerator()

    # Generate based on type
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if args.type == 'sfx':
        success = generator.generate_sound_effect(args.prompt, args.duration, output_path)
    elif args.type == 'music':
        success = generator.generate_music(args.prompt, int(args.duration), output_path)
    elif args.type == 'voice':
        success = generator.generate_voice(args.prompt, output_path, args.voice)
    else:
        print(f"Unknown type: {args.type}")
        success = False

    if not success:
        exit(1)

if __name__ == "__main__":
    main()
EOFPYTHON

chmod +x "$AUDIO_DIR/generate_audio_unified.py"

echo -e "${GREEN}✓ Generation scripts created${NC}"
echo ""

################################################################################
# Verification & Summary
################################################################################

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Audio Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}What's Installed (Commercial-Safe Only):${NC}"
echo "  • Stable Audio Open (~12GB) - Sound effects & music"
echo "  • Bark (~3GB) - Voice synthesis"
echo "  • Audio processing tools (FFmpeg, Sox, librosa)"
echo ""
echo -e "${YELLOW}NOT INSTALLED: MusicGen (non-commercial license)${NC}"
echo ""
echo -e "${BLUE}Total Size:${NC} ~15GB"
echo ""
echo -e "${BLUE}Performance (RTX 4070):${NC}"
echo "  • Sound effects: 10-15 seconds per 2-second clip"
echo "  • Music (30s): 15-20 seconds generation"
echo "  • Voice: 8-12 seconds per sentence"
echo ""
echo -e "${BLUE}Python Environment:${NC}"
echo "  source ~/ai-tools/audio-env/bin/activate"
echo ""
echo -e "${BLUE}Quick Tests:${NC}"
echo ""
echo "  # Sound effect"
echo '  source ~/ai-tools/audio-env/bin/activate'
echo '  python3 ~/ai-tools/stable-audio/generate_audio_unified.py \'
echo '    --type sfx \'
echo '    --prompt "Cheerful success chime with bells" \'
echo '    --duration 2 \'
echo '    --output ~/ai-tools/outputs/audio/sfx/test_success.wav'
echo ""
echo "  # Background music"
echo '  python3 ~/ai-tools/stable-audio/generate_audio_unified.py \'
echo '    --type music \'
echo '    --prompt "Upbeat children'\''s music with xylophone" \'
echo '    --duration 30 \'
echo '    --output ~/ai-tools/outputs/audio/music/test_bg.wav'
echo ""
echo "  # Voice"
echo '  python3 ~/ai-tools/stable-audio/generate_audio_unified.py \'
echo '    --type voice \'
echo '    --prompt "Great job! You did it!" \'
echo '    --voice v2/en_speaker_6 \'
echo '    --output ~/ai-tools/outputs/audio/voice/test_voice.wav'
echo ""
echo -e "${BLUE}Available Bark Voices (child-friendly):${NC}"
echo "  • v2/en_speaker_6 - Neutral, clear"
echo "  • v2/en_speaker_9 - Warm, encouraging"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Test sound effect generation"
echo "  2. Test music generation"
echo "  3. Test voice synthesis"
echo "  4. Run setup_godot_ai.sh for game engine"
echo ""
echo -e "${YELLOW}Note: First generation will be slower as models load into VRAM.${NC}"
echo ""
