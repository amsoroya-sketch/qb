# AI Model Download Setup Scripts

**Location:** `~/ai-tools/`

## Created Scripts

These scripts have been created in `~/ai-tools/` for downloading AI models:

### 1. download_models.py
Interactive Python script with full features:
- Disk space checking
- Progress tracking with colors
- Gated model handling
- Comprehensive error handling
- Resume capability
- Detailed summary reports

**Usage:**
```bash
cd ~/ai-tools
source hf-env/bin/activate
python download_models.py
```

### 2. download_models_cli.sh
Quick bash script using huggingface-cli:
- Simple and fast
- Built-in progress bars
- Resume on failure
- Interactive prompts

**Usage:**
```bash
cd ~/ai-tools
./download_models_cli.sh
```

### 3. test_flux.py
Test script for FLUX.1-schnell image generation:
- Generates test educational game asset
- Verifies GPU/CUDA setup
- Creates output in `~/ai-tools/test_outputs/`

**Usage:**
```bash
cd ~/ai-tools
source hf-env/bin/activate
python test_flux.py
```

### 4. README.md
Complete documentation for the ai-tools directory:
- Quick start guide
- Model descriptions
- Troubleshooting steps
- System requirements

## Models to Download

| Model | Size | Priority | Usage |
|-------|------|----------|-------|
| FLUX.1-schnell | 12GB | Critical | Game asset images |
| Stable Audio | 2GB | High | SFX and music |
| Bark | 10GB | High | Voice synthesis |
| Llama 3.1 8B | 16GB | Medium | Content generation |
| Whisper v3 | 3GB | Medium | Speech recognition |
| CLIP ViT | 1.7GB | Low | Image validation |

**Total:** ~45GB

## Installation Status

✓ Virtual environment: `~/ai-tools/hf-env/`
✓ PyTorch 2.5.1 + CUDA 12.1
✓ Hugging Face Hub 0.35.3
✓ Authentication: soroya
✓ GPU: RTX 4070 Laptop (8GB VRAM)

## Next Steps

1. Run one of the download scripts to get all models
2. Test FLUX with test_flux.py
3. Continue Day 2 of Hugging Face roadmap
4. Start generating assets for games

## Related Files

- Roadmap: `game_design/technical_specs/HUGGINGFACE_SETUP_LEARNING_ROADMAP.md`
- Expert agents: `agent_system/agents/12_flux_image_expert.md` (and others)
- Game designs: `game_design/month_*_games/GAME_*.md`
