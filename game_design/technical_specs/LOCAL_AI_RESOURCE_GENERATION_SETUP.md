# Local AI Resource Generation Setup Guide
## Open Source Tools for Game Asset Creation
**SkillBridge Educational Gaming Platform**

---

## EXECUTIVE SUMMARY

This document provides a complete setup guide for **local AI-powered resource generation** using **100% open source tools**. No cloud APIs, no subscription fees - everything runs on your local hardware.

### Your System Capabilities
✅ **Excellent hardware for local AI generation**
- **GPU**: NVIDIA GeForce RTX 4070 Mobile (8GB VRAM)
- **CPU**: Intel Core i9-14900HX (24 cores, 32 threads)
- **RAM**: 32GB DDR5
- **Storage**: 354GB free space
- **OS**: Linux (Ubuntu/Debian based)

### Resource Generation Capabilities
With this setup, you can generate:
1. **Images**: Character sprites, UI elements, backgrounds, emotion faces
2. **Audio**: Sound effects, background music, voice-overs
3. **3D Models**: Simple 3D objects for Unity games (optional)
4. **Animations**: Sprite animations, transitions

**Estimated Cost**: $0 (all open source)
**Setup Time**: 2-4 hours
**Model Download Size**: ~20-50GB

---

## 1. HARDWARE ASSESSMENT

### 1.1 Current System Specifications

```
┌─────────────────────────────────────────────────┐
│           SYSTEM SPECIFICATIONS                 │
├─────────────────────────────────────────────────┤
│ GPU: NVIDIA GeForce RTX 4070 Mobile             │
│   - VRAM: 8GB GDDR6                             │
│   - CUDA Cores: 4608                            │
│   - Tensor Cores: 144 (4th gen)                 │
│   - Ray Tracing Cores: 36 (3rd gen)             │
│   - Architecture: Ada Lovelace                  │
│                                                 │
│ CPU: Intel Core i9-14900HX                      │
│   - Cores: 24 (8P + 16E)                        │
│   - Threads: 32                                 │
│   - Base/Boost: 2.2 GHz / 5.8 GHz               │
│   - Cache: 36MB L3                              │
│                                                 │
│ RAM: 32GB DDR5                                  │
│   - Available: 26GB (with OS overhead)          │
│                                                 │
│ Storage: 354GB free                             │
│   - Type: NVMe SSD (fast read/write)            │
│                                                 │
│ OS: Linux 6.14.0-33-generic                     │
└─────────────────────────────────────────────────┘
```

### 1.2 AI Workload Capability Assessment

| Task | Feasibility | Performance Estimate | VRAM Usage | Notes |
|------|------------|---------------------|------------|-------|
| **Stable Diffusion (512x512)** | ✅ Excellent | ~3-5 sec/image | 4-6GB | Perfect for character sprites, UI |
| **Stable Diffusion (1024x1024)** | ✅ Good | ~8-12 sec/image | 6-8GB | Backgrounds, high-res assets |
| **SDXL (1024x1024)** | ⚠️ Possible | ~25-40 sec/image | 7-8GB | Highest quality, slower |
| **Audio Generation (MusicGen)** | ✅ Excellent | ~10-20 sec/30sec audio | 2-4GB | Background music, sound effects |
| **Voice Synthesis (Bark)** | ✅ Excellent | ~5-15 sec/sentence | 2-4GB | Voice-overs, instructions |
| **3D Model Generation (Shap-E)** | ✅ Good | ~30-60 sec/model | 4-6GB | Simple 3D objects (optional) |
| **Video Generation (AnimateDiff)** | ⚠️ Slow | ~2-5 min/4sec video | 6-8GB | Animations (limited use) |

**Legend**:
- ✅ Excellent: Fast, production-ready
- ✅ Good: Usable, acceptable speed
- ⚠️ Possible: Slow but functional
- ❌ Not Recommended: Too slow/insufficient resources

### 1.3 Storage Requirements

| Component | Size | Purpose |
|-----------|------|---------|
| **Stable Diffusion 1.5 Models** | 5-7GB | Base image generation |
| **SDXL Models** (optional) | 6-8GB | High-quality images |
| **LoRA Fine-tunes** | 100-500MB each | Style-specific models (cartoon, realistic) |
| **Audio Models (MusicGen)** | 3-5GB | Music and sound effects |
| **Voice Models (Bark)** | 8-12GB | Text-to-speech |
| **ComfyUI + Extensions** | 2-3GB | Workflow interface |
| **Python Dependencies** | 5-10GB | PyTorch, libraries |
| **Working Space (temp files)** | 20-50GB | Generation cache, outputs |
| **Total Estimated** | **50-100GB** | Full setup |

**Available**: 354GB ✅ **Sufficient for full setup + plenty of workspace**

---

## 2. SOFTWARE STACK (100% OPEN SOURCE)

### 2.1 Core AI Infrastructure

#### NVIDIA CUDA Toolkit (Required for GPU acceleration)
```bash
# Check if CUDA is already installed
nvcc --version

# If not installed, install NVIDIA drivers + CUDA toolkit
# For Ubuntu/Debian:
sudo apt update
sudo apt install nvidia-driver-535  # Or latest version
sudo apt install nvidia-cuda-toolkit

# Verify installation
nvidia-smi
```

**License**: Free (NVIDIA EULA)
**Purpose**: GPU acceleration for AI models
**VRAM Usage**: 0GB (driver layer)

---

### 2.2 Image Generation Tools

#### A. Stable Diffusion WebUI (AUTOMATIC1111)
**Best for**: Quick image generation, experimentation

```bash
# Installation
cd ~/ai-tools
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# Install dependencies and run
./webui.sh --xformers --api

# Access at: http://localhost:7860
```

**License**: AGPL-3.0 (open source)
**Features**:
- Text-to-image generation
- Image-to-image editing
- Inpainting (fix parts of images)
- ControlNet (pose/edge guidance)
- API for automation

**VRAM Usage**: 4-8GB
**Speed**: 3-5 sec per 512x512 image
**Output**: PNG images, 512x512 to 2048x2048

---

#### B. ComfyUI (Recommended for Production)
**Best for**: Automated workflows, batch processing

```bash
# Installation
cd ~/ai-tools
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt

# Run ComfyUI
python main.py --listen 0.0.0.0 --port 8188

# Access at: http://localhost:8188
```

**License**: GPL-3.0 (open source)
**Features**:
- Node-based workflow (drag-and-drop)
- Batch processing (generate 100s of images)
- API for automation
- Custom nodes/extensions
- More control than AUTOMATIC1111

**VRAM Usage**: 4-8GB
**Speed**: 3-5 sec per 512x512 image
**Output**: PNG images, any resolution

---

#### C. Stable Diffusion Models (Download Required)

**Base Model (Required)**:
```bash
# Download Stable Diffusion 1.5 (most compatible)
cd ~/ai-tools/ComfyUI/models/checkpoints
wget https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors

# OR download via browser:
# https://huggingface.co/runwayml/stable-diffusion-v1-5
```

**Specialized Models (Optional but Recommended)**:

1. **Realistic Vision (for realistic characters)**
   - Link: https://huggingface.co/SG161222/Realistic_Vision_V5.1
   - Size: 2GB
   - Use case: Realistic emotion faces, people

2. **Cartoon Diffusion (for cartoon style)**
   - Link: https://huggingface.co/stablediffusionapi/cartoon-diffusion
   - Size: 2GB
   - Use case: Child-friendly characters

3. **DreamShaper (versatile)**
   - Link: https://huggingface.co/Lykon/DreamShaper
   - Size: 2GB
   - Use case: General purpose, good quality

**License**: CreativeML Open RAIL-M (free for commercial use with attribution)

---

### 2.3 Audio Generation Tools

#### A. AudioCraft (Meta/Facebook AI)
**Best for**: Music, sound effects, ambient audio

```bash
# Installation
cd ~/ai-tools
git clone https://github.com/facebookresearch/audiocraft.git
cd audiocraft

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .
pip install torch torchaudio

# Download models (automatic on first run)
python -c "from audiocraft.models import MusicGen; MusicGen.get_pretrained('medium')"
```

**License**: MIT (open source)
**Features**:
- **MusicGen**: Generate background music from text prompts
- **AudioGen**: Generate sound effects (footsteps, door closing, etc.)
- Multiple model sizes: small (300MB), medium (1.5GB), large (3.3GB)

**Models Available**:
- `small`: 300MB, 30M parameters, fast (5 sec for 30sec audio)
- `medium`: 1.5GB, 1.5B parameters, balanced (10 sec for 30sec audio)
- `large`: 3.3GB, 3.3B parameters, best quality (20 sec for 30sec audio)

**VRAM Usage**: 2-4GB
**Speed**: 10-20 seconds for 30-second audio clip
**Output**: WAV/MP3, 16kHz/32kHz

**Example Usage**:
```python
from audiocraft.models import MusicGen
import torchaudio

model = MusicGen.get_pretrained('medium')
model.set_generation_params(duration=10)  # 10 seconds

descriptions = ["upbeat cheerful children's music with xylophone"]
wav = model.generate(descriptions)

# Save output
for idx, one_wav in enumerate(wav):
    torchaudio.save(f'output_{idx}.wav', one_wav.cpu(), 32000)
```

---

#### B. Bark (Suno AI Voice Synthesis)
**Best for**: Voice-overs, text-to-speech, instructions

```bash
# Installation
pip install git+https://github.com/suno-ai/bark.git

# Download models (automatic on first run)
python -c "from bark import SAMPLE_RATE, generate_audio, preload_models; preload_models()"
```

**License**: MIT (open source)
**Features**:
- Text-to-speech with emotion/intonation
- Multiple voices (male, female, child-like)
- Background sounds (laughter, sighs)
- Multi-language support

**Models**: 8-12GB total (auto-downloads on first use)
**VRAM Usage**: 2-4GB
**Speed**: 5-15 seconds per sentence
**Output**: WAV audio, 24kHz

**Example Usage**:
```python
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

preload_models()

text_prompt = "Hello! Great job matching those colors. [laughs]"
audio_array = generate_audio(text_prompt, history_prompt="v2/en_speaker_6")

write_wav("output.wav", SAMPLE_RATE, audio_array)
```

**Available Voices**:
- `v2/en_speaker_0` to `v2/en_speaker_9` (various English voices)
- Some voices sound child-friendly (e.g., speaker_6)

---

### 2.4 Automation & Workflow Tools

#### A. Python Scripts for Batch Processing
```bash
# Create automation directory
mkdir -p ~/ai-tools/automation
cd ~/ai-tools/automation

# Install dependencies
pip install requests pillow pandas openpyxl
```

**Purpose**: Read asset specifications from spreadsheet, generate assets automatically

---

#### B. Asset Management System
```bash
# Install s3cmd (local alternative: MinIO)
# For local storage, use simple file system organization

mkdir -p ~/ai-tools/generated-assets/{images,audio,animations}
```

---

### 2.5 Optional Advanced Tools

#### A. ControlNet (Precise Image Control)
**Use case**: Generate images with specific poses, layouts

```bash
# For ComfyUI
cd ~/ai-tools/ComfyUI/custom_nodes
git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git

# Download ControlNet models
cd ~/ai-tools/ComfyUI/models/controlnet
wget https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_openpose.pth
```

**Models**: 1.5GB each (download only what you need)
**Use case**: Control character pose, edge detection, depth

---

#### B. Upscalers (Enhance Resolution)
**Use case**: Upscale 512x512 images to 1024x1024 or higher

```bash
# Real-ESRGAN (image upscaling)
pip install realesrgan

# Download model
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth
```

**VRAM Usage**: 1-2GB
**Speed**: 2-5 sec per image
**Output**: 4x upscale (512x512 → 2048x2048)

---

## 3. COMPLETE INSTALLATION GUIDE

### 3.1 Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git wget curl python3 python3-pip python3-venv
sudo apt install -y build-essential libssl-dev libffi-dev
sudo apt install -y ffmpeg  # For audio processing
```

### 3.2 Install NVIDIA Drivers + CUDA

```bash
# Install NVIDIA driver
sudo apt install -y nvidia-driver-535

# Install CUDA toolkit
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install -y cuda-toolkit-12-1

# Add to PATH
echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc

# Reboot system
sudo reboot

# After reboot, verify
nvidia-smi
nvcc --version
```

### 3.3 Install PyTorch (AI Framework)

```bash
# Create base environment
mkdir -p ~/ai-tools
cd ~/ai-tools
python3 -m venv ai-env
source ai-env/bin/activate

# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Verify GPU detection
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0)}')"

# Expected output:
# CUDA Available: True
# GPU: NVIDIA GeForce RTX 4070 Mobile
```

### 3.4 Install ComfyUI (Image Generation)

```bash
cd ~/ai-tools
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install -r requirements.txt

# Download Stable Diffusion 1.5 model
mkdir -p models/checkpoints
cd models/checkpoints
wget https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors

# Download VAE (improves image quality)
cd ../vae
wget https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors

# Run ComfyUI
cd ~/ai-tools/ComfyUI
python main.py --listen 0.0.0.0 --port 8188

# Access at: http://localhost:8188
```

### 3.5 Install AudioCraft (Audio Generation)

```bash
cd ~/ai-tools
git clone https://github.com/facebookresearch/audiocraft.git
cd audiocraft

# Install
pip install -e .

# Download MusicGen model (medium = 1.5GB)
python -c "from audiocraft.models import MusicGen; MusicGen.get_pretrained('medium')"

# Download AudioGen model
python -c "from audiocraft.models import AudioGen; AudioGen.get_pretrained('medium')"
```

### 3.6 Install Bark (Voice Synthesis)

```bash
pip install git+https://github.com/suno-ai/bark.git

# Preload models (8-12GB download)
python -c "from bark import preload_models; preload_models()"
```

### 3.7 Install Supporting Tools

```bash
# Real-ESRGAN (upscaling)
pip install realesrgan
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth -P ~/ai-tools/models/

# Python automation libraries
pip install requests pillow pandas openpyxl tqdm
```

---

## 4. RESOURCE GENERATION WORKFLOWS

### 4.1 Image Generation Workflow (ComfyUI)

#### Step 1: Create Asset Specification
```csv
# assets.csv
asset_id,type,description,size,style,quantity
EMO-001,image,"Happy child face, neutral skin, simple cartoon style",512x512,cartoon,1
EMO-002,image,"Sad child face, neutral skin, simple cartoon style",512x512,cartoon,1
BG-001,image,"Classroom background, colorful, child-friendly",1024x768,realistic,1
UI-BTN-001,image,"Green play button with white triangle icon",200x200,flat_design,1
```

#### Step 2: Automated Generation Script

```python
# generate_images.py
import requests
import json
import base64
import pandas as pd
from pathlib import Path
import time

COMFYUI_URL = "http://localhost:8188"

def generate_image(prompt, width=512, height=512, steps=20):
    """Generate image using ComfyUI API"""

    workflow = {
        "3": {
            "inputs": {
                "seed": int(time.time()),
                "steps": steps,
                "cfg": 7.0,
                "sampler_name": "euler_ancestral",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
            },
            "class_type": "KSampler"
        },
        "4": {
            "inputs": {"ckpt_name": "v1-5-pruned-emaonly.safetensors"},
            "class_type": "CheckpointLoaderSimple"
        },
        "5": {
            "inputs": {"width": width, "height": height, "batch_size": 1},
            "class_type": "EmptyLatentImage"
        },
        "6": {
            "inputs": {"text": prompt, "clip": ["4", 1]},
            "class_type": "CLIPTextEncode"
        },
        "7": {
            "inputs": {
                "text": "ugly, blurry, low quality, distorted, text, watermark",
                "clip": ["4", 1]
            },
            "class_type": "CLIPTextEncode"
        },
        "8": {
            "inputs": {"samples": ["3", 0], "vae": ["4", 2]},
            "class_type": "VAEDecode"
        },
        "9": {
            "inputs": {"filename_prefix": "generated", "images": ["8", 0]},
            "class_type": "SaveImage"
        }
    }

    response = requests.post(f"{COMFYUI_URL}/prompt", json={"prompt": workflow})
    return response.json()

# Read asset specifications
df = pd.read_csv('assets.csv')

# Generate images
for idx, row in df.iterrows():
    if row['type'] == 'image':
        print(f"Generating {row['asset_id']}: {row['description']}")

        # Parse size
        width, height = map(int, row['size'].split('x'))

        # Create optimized prompt
        prompt = f"{row['description']}, {row['style']} style, high quality, clean, simple"

        # Generate
        result = generate_image(prompt, width, height)

        print(f"  ✓ Generated {row['asset_id']}")
        time.sleep(2)  # Prevent overload

print("All images generated!")
```

#### Step 3: Run Generation
```bash
python generate_images.py
```

**Output**: Images saved to `~/ai-tools/ComfyUI/output/`

---

### 4.2 Audio Generation Workflow (AudioCraft)

#### Step 1: Audio Asset Specification
```csv
# audio_assets.csv
asset_id,type,description,duration
SFX-001,sound_effect,"success chime, bright, cheerful, xylophone",2
SFX-002,sound_effect,"error sound, gentle, non-scary, low tone",1.5
MUS-001,music,"upbeat children's background music, playful, xylophone and piano",30
VO-001,voice,"Great job! You matched the colors correctly.",3
```

#### Step 2: Automated Audio Generation

```python
# generate_audio.py
import pandas as pd
from audiocraft.models import MusicGen, AudioGen
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav
import torch

# Load models
print("Loading models...")
music_model = MusicGen.get_pretrained('medium')
audio_model = AudioGen.get_pretrained('medium')
preload_models()  # Bark voice model

# Read specifications
df = pd.read_csv('audio_assets.csv')

for idx, row in df.iterrows():
    asset_id = row['asset_id']
    asset_type = row['type']
    description = row['description']
    duration = row['duration']

    print(f"Generating {asset_id}: {description}")

    if asset_type == 'sound_effect':
        # Use AudioGen
        audio_model.set_generation_params(duration=duration)
        wav = audio_model.generate([description])
        output_path = f"outputs/audio/{asset_id}.wav"

        import torchaudio
        torchaudio.save(output_path, wav[0].cpu(), 16000)

    elif asset_type == 'music':
        # Use MusicGen
        music_model.set_generation_params(duration=int(duration))
        wav = music_model.generate([description])
        output_path = f"outputs/audio/{asset_id}.wav"

        import torchaudio
        torchaudio.save(output_path, wav[0].cpu(), 32000)

    elif asset_type == 'voice':
        # Use Bark
        audio_array = generate_audio(description, history_prompt="v2/en_speaker_6")
        output_path = f"outputs/audio/{asset_id}.wav"
        write_wav(output_path, SAMPLE_RATE, audio_array)

    print(f"  ✓ Saved to {output_path}")

print("All audio generated!")
```

#### Step 3: Run Audio Generation
```bash
python generate_audio.py
```

**Output**: Audio files saved to `outputs/audio/`

---

### 4.3 Batch Processing for Game Assets

#### Master Automation Script
```python
# master_asset_generator.py
import pandas as pd
import subprocess
import os
from pathlib import Path

def setup_directories():
    """Create output directories"""
    dirs = [
        'outputs/images/characters',
        'outputs/images/backgrounds',
        'outputs/images/ui',
        'outputs/audio/sfx',
        'outputs/audio/music',
        'outputs/audio/voice'
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)

def process_game_assets(game_id, asset_spreadsheet):
    """Process all assets for a game"""

    setup_directories()

    # Read master asset list
    df = pd.read_excel(asset_spreadsheet)

    # Separate by type
    images = df[df['type'].str.contains('image|sprite|background', case=False)]
    audio = df[df['type'].str.contains('audio|sound|music|voice', case=False)]

    # Generate images
    print(f"Generating {len(images)} images...")
    for idx, row in images.iterrows():
        # Call ComfyUI API (simplified)
        print(f"  - {row['asset_id']}: {row['description']}")
        # ... generation code ...

    # Generate audio
    print(f"Generating {len(audio)} audio files...")
    for idx, row in audio.iterrows():
        # Call AudioCraft/Bark (simplified)
        print(f"  - {row['asset_id']}: {row['description']}")
        # ... generation code ...

    print(f"✅ All assets for {game_id} generated!")

# Example usage
if __name__ == "__main__":
    process_game_assets(
        game_id="game_005_emotion_matching",
        asset_spreadsheet="specs/game_005_assets.xlsx"
    )
```

---

## 5. PERFORMANCE OPTIMIZATION

### 5.1 VRAM Optimization

#### A. Use Model Offloading (for 8GB VRAM)
```python
# For Stable Diffusion in ComfyUI
# Edit: ComfyUI/extra_model_paths.yaml

# Enable model offloading
import torch
torch.cuda.set_per_process_memory_fraction(0.9)  # Use 90% of VRAM max
```

#### B. Use Lower Precision (FP16 instead of FP32)
```bash
# ComfyUI automatically uses FP16 on NVIDIA GPUs
# For custom scripts:
model = model.half()  # Convert to FP16
```

#### C. Clear Cache Between Generations
```python
import torch
torch.cuda.empty_cache()  # Clear VRAM after each generation
```

### 5.2 Speed Optimization

#### A. Use Faster Samplers
- **Fastest**: Euler A, DPM++ 2M (15-20 steps)
- **Balanced**: DPM++ SDE (20-25 steps)
- **Highest Quality**: DPM++ 2M Karras (30-40 steps)

#### B. Batch Processing
```python
# Generate multiple images in parallel (if VRAM allows)
batch_size = 4  # Generate 4 images at once
```

#### C. Use Compiled Models (TensorRT - Advanced)
```bash
# Compile model for 2-3x speed boost (one-time setup)
# Requires NVIDIA TensorRT
pip install tensorrt
# ... compilation steps (advanced, optional)
```

### 5.3 Quality vs Speed Trade-offs

| Quality Level | Steps | Sampler | Time (512x512) | Use Case |
|--------------|-------|---------|---------------|----------|
| **Draft** | 10-15 | Euler A | 2-3 sec | Quick previews |
| **Standard** | 20-25 | DPM++ 2M | 4-6 sec | Production assets |
| **High** | 30-40 | DPM++ 2M Karras | 8-12 sec | Final polish |
| **Maximum** | 50+ | DPM++ SDE | 15-20 sec | Hero images only |

**Recommendation for production**: Use **Standard** (20 steps, DPM++ 2M)

---

## 6. ASSET QUALITY CONTROL

### 6.1 Automated Quality Checks

```python
# quality_check.py
from PIL import Image
import os

def check_image_quality(image_path, min_width=512, min_height=512):
    """Validate generated images"""
    img = Image.open(image_path)

    checks = {
        'resolution': img.size[0] >= min_width and img.size[1] >= min_height,
        'format': img.format in ['PNG', 'JPEG'],
        'mode': img.mode in ['RGB', 'RGBA'],
        'file_size': os.path.getsize(image_path) > 10_000,  # >10KB
    }

    if not all(checks.values()):
        print(f"⚠️ Quality issue in {image_path}:")
        for check, passed in checks.items():
            if not passed:
                print(f"  - {check}: FAILED")
        return False

    print(f"✓ {image_path} passed quality checks")
    return True

# Check all generated images
for img in Path('outputs/images').rglob('*.png'):
    check_image_quality(img)
```

### 6.2 Manual Review Checklist

**For Each Image**:
- [ ] Matches description from asset spec
- [ ] Correct resolution (512x512, 1024x1024, etc.)
- [ ] No unwanted text/watermarks
- [ ] No distorted/blurry areas
- [ ] Appropriate for children (no scary/inappropriate content)
- [ ] Consistent art style with other assets

**For Each Audio**:
- [ ] Matches description
- [ ] Correct duration (±2 seconds acceptable)
- [ ] No clipping/distortion
- [ ] Appropriate volume level
- [ ] Child-friendly (no harsh/scary sounds)

---

## 7. INTEGRATION WITH GAME WORKFLOW

### 7.1 Updated Step 8 Workflow (Local AI)

```
PM-001: [Asset Spec Spreadsheet] → AI-RES-001
  ↓
AI-RES-001: Reviews assets marked "AI generation"
  ↓
AI-RES-001 → PROMPT-001: [Assign image generation] (24 emotion faces)
AI-RES-001 → PROMPT-002: [Assign audio generation] (12 sound effects)
  ↓
PROMPT-001: Generates images via LOCAL ComfyUI:

  python generate_images.py --input assets.csv --output outputs/images/

  Runtime: 24 images × 5 seconds = 2 minutes
  Quality review: 15 minutes
  Total time: 20 minutes (vs 1 hour with DALL-E 3)
  ↓
PROMPT-002: Generates audio via LOCAL AudioCraft:

  python generate_audio.py --input audio_assets.csv --output outputs/audio/

  Runtime: 12 audio clips × 15 seconds = 3 minutes
  Quality review: 10 minutes
  Total time: 15 minutes
  ↓
AI-RES-001: [Quality Review] → Checks all assets meet specs
  ↓
AI-RES-001: [Organizes Assets] → Folder structure:
  /game_005/
    /characters/
      happy_face.png
      sad_face.png
      ...
    /ui/
      play_button.png
      ...
    /audio/
      success_chime.wav
      ...
  ↓
AI-RES-001 → PM-001: [Assets Ready for Handoff]
```

### 7.2 Cost Comparison: Local vs Cloud APIs

| Item | Cloud APIs (Original Plan) | Local Open Source | Savings |
|------|----------------------------|-------------------|---------|
| **Initial Setup** | $0 | $0 (free software) | $0 |
| **Image Generation** (24 images) | DALL-E 3: $0.04 × 24 = $0.96 | $0 (local) | $0.96 |
| **Audio Generation** (12 clips) | ElevenLabs: $0.30 × 12 = $3.60 | $0 (local) | $3.60 |
| **Per Game Total** | ~$5-10 | $0 | **$5-10** |
| **Per 10 Games** | ~$50-100 | $0 | **$50-100** |
| **Per 75 Games (Year 1)** | ~$375-750 | $0 | **$375-750** |

**Additional Benefits of Local**:
- ✅ No rate limits (cloud APIs limit requests/minute)
- ✅ No internet required
- ✅ Complete privacy (no data sent to cloud)
- ✅ Unlimited iterations (regenerate as many times as needed)
- ✅ Custom models (fine-tune for specific art style)

---

## 8. INSTALLATION CHECKLIST

### Pre-Installation (5 minutes)
- [ ] Verify 50GB+ free disk space
- [ ] Ensure stable internet (for model downloads)
- [ ] Close unnecessary applications

### System Setup (30 minutes)
- [ ] Install NVIDIA drivers (535 or later)
- [ ] Install CUDA toolkit (12.1 or later)
- [ ] Reboot system
- [ ] Verify with `nvidia-smi`

### AI Tools Setup (1-2 hours)
- [ ] Install PyTorch with CUDA support
- [ ] Install ComfyUI for image generation
- [ ] Download Stable Diffusion 1.5 model (5GB)
- [ ] Install AudioCraft for audio/music
- [ ] Download MusicGen medium model (1.5GB)
- [ ] Install Bark for voice synthesis
- [ ] Download Bark models (8-12GB)

### Optional Tools (30 minutes)
- [ ] Install Real-ESRGAN for upscaling
- [ ] Install ControlNet for pose control
- [ ] Download additional Stable Diffusion models (cartoon, realistic)

### Automation Setup (20 minutes)
- [ ] Install Python automation libraries
- [ ] Create directory structure
- [ ] Test generation scripts

### Testing & Validation (20 minutes)
- [ ] Generate test image (512x512)
- [ ] Generate test audio (10 sec music)
- [ ] Generate test voice (1 sentence)
- [ ] Verify quality of outputs

**Total Estimated Time**: 2-4 hours (mostly downloads)

---

## 9. TROUBLESHOOTING

### Issue: "CUDA out of memory"
**Solution**:
```python
# Reduce batch size
batch_size = 1

# Use lower resolution
width, height = 512, 512  # instead of 1024

# Enable model offloading
import torch
torch.cuda.empty_cache()
```

### Issue: "Model download fails"
**Solution**:
```bash
# Download manually from Hugging Face
# Use browser or wget with resume capability
wget -c [model_url]  # -c resumes interrupted downloads
```

### Issue: "Generation is too slow"
**Solution**:
- Use faster samplers (Euler A, DPM++ 2M)
- Reduce steps to 15-20
- Lower resolution to 512x512
- Ensure GPU is being used: `torch.cuda.is_available()` should return `True`

### Issue: "Images have artifacts/distortions"
**Solution**:
- Increase steps to 25-30
- Use better sampler (DPM++ 2M Karras)
- Download VAE model for improved quality
- Adjust CFG scale (try 7-9)

### Issue: "Voice sounds robotic"
**Solution**:
- Bark: Try different speaker voices (v2/en_speaker_0 to _9)
- Add emotion tags: "[happy]", "[sad]", "[enthusiastic]"
- Keep sentences short (under 20 words)

---

## 10. NEXT STEPS

### Immediate Actions (Week 1)
1. **Day 1**: Install NVIDIA drivers + CUDA toolkit
2. **Day 2**: Install ComfyUI + download Stable Diffusion models
3. **Day 3**: Install AudioCraft + Bark
4. **Day 4**: Test generation scripts with sample assets
5. **Day 5**: Generate assets for Game 01 (Color Matching)

### Short-Term (Month 1)
- Fine-tune prompts for consistent art style
- Create prompt templates for common asset types
- Build automated quality check pipeline
- Document best practices for team

### Long-Term (Month 2-3)
- Train custom LoRA models for brand-specific art style
- Optimize generation pipeline for speed
- Create web interface for non-technical team members
- Integrate with Unity asset import workflow

---

## 11. RESOURCE LINKS

### Official Documentation
- **ComfyUI**: https://github.com/comfyanonymous/ComfyUI
- **Stable Diffusion**: https://github.com/Stability-AI/stablediffusion
- **AudioCraft**: https://github.com/facebookresearch/audiocraft
- **Bark**: https://github.com/suno-ai/bark

### Model Repositories
- **Hugging Face**: https://huggingface.co/models
- **Civitai** (SD models): https://civitai.com

### Community & Support
- **Reddit r/StableDiffusion**: https://reddit.com/r/stablediffusion
- **ComfyUI Discord**: https://discord.gg/comfyui
- **Hugging Face Forums**: https://discuss.huggingface.co

---

## 12. SUMMARY

### ✅ What You Have
- **Excellent Hardware**: RTX 4070 (8GB VRAM), i9-14900HX (32 threads), 32GB RAM
- **Sufficient Storage**: 354GB free space
- **Optimal OS**: Linux (best for AI tools)

### ✅ What You Need
- **Software**: 100% free and open source
- **Models**: ~50GB downloads (one-time)
- **Setup Time**: 2-4 hours

### ✅ What You'll Get
- **Image Generation**: 3-5 sec per 512x512 image (unlimited)
- **Audio Generation**: 10-20 sec per 30-second clip (unlimited)
- **Voice Synthesis**: 5-15 sec per sentence (unlimited)
- **Cost**: $0 per game (vs $5-10 with cloud APIs)

### ✅ Performance Estimates (Per Game)
- **24 Images**: ~2-3 minutes generation + 15 min review = **20 minutes**
- **12 Audio Clips**: ~3-5 minutes generation + 10 min review = **15 minutes**
- **Total Asset Generation Time**: **35 minutes** (vs 1-2 days with cloud APIs + manual work)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Status**: Ready for Implementation
**Created By**: AI-RES-001 Agent
**Hardware Assessed**: NVIDIA RTX 4070 Mobile, Intel i9-14900HX, 32GB RAM
