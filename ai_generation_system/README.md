# SkillBridge AI Tools Setup

## Overview
This directory contains tools and scripts for downloading and testing AI models used in the SkillBridge Educational Gaming Platform.

## Quick Start

### Environment Setup ✓
```bash
source ~/ai-tools/hf-env/bin/activate
```

### Authentication ✓
Already authenticated as: **soroya**

## Download Models

You have **TWO options** for downloading models:

### Option 1: Interactive Python Script (Recommended)
Full-featured with progress tracking, error handling, and detailed summaries.

```bash
cd ~/ai-tools
source hf-env/bin/activate
python download_models.py
```

**Features:**
- Disk space check before download
- Interactive prompts for gated models
- Detailed progress tracking
- Comprehensive summary report
- Resume capability if interrupted

### Option 2: Quick CLI Script
Faster, simpler script using huggingface-cli directly.

```bash
cd ~/ai-tools
./download_models_cli.sh
```

**Features:**
- Built-in progress bars
- Quick resume on failure
- Simple y/n prompts
- Lightweight

## Models to Download

| Model | Size | Priority | Purpose |
|-------|------|----------|---------|
| **FLUX.1-schnell** | 12GB | Critical | Fast image generation (4-step) |
| **Stable Audio** | 2GB | High | Audio/SFX for games |
| **Bark** | 10GB | High | Voice synthesis/TTS |
| **Llama 3.1 8B** | 16GB | Medium | Text/content generation |
| **Whisper v3** | 3GB | Medium | Speech recognition |
| **CLIP ViT** | 1.7GB | Low | Image validation |

**Total:** ~45GB

## Important Notes

### Gated Models
**Llama 3.1 8B** requires accepting Meta's license:
1. Visit: https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct
2. Click "Agree and access repository"
3. Then run the download script

### Cache Location
All models download to: `~/.cache/huggingface/hub/`

Models are automatically cached and reused across scripts.

### Resume Downloads
Both scripts support resuming interrupted downloads. Just run again!

## Test Scripts

### Test FLUX Image Generation
```bash
cd ~/ai-tools
source hf-env/bin/activate
python test_flux.py
```

Generates a test image of a cartoon apple (educational game asset).

**Output location:** `~/ai-tools/test_outputs/flux_test_*.png`

## System Requirements

- **GPU:** RTX 4070 Laptop (8GB VRAM) ✓
- **CUDA:** 12.1 ✓
- **Python:** 3.12.3 ✓
- **PyTorch:** 2.5.1+cu121 ✓
- **Disk Space:** 50GB+ recommended

## Installation Summary

✓ Virtual environment created
✓ PyTorch with CUDA installed
✓ Hugging Face packages installed
✓ Authentication complete
✓ GPU detected and working

## Next Steps

1. **Download models** (choose one script above)
2. **Test image generation** with `test_flux.py`
3. **Continue Day 2** of Hugging Face learning roadmap
4. **Generate assets** for Game 01: Color Matching Puzzle

## Troubleshooting

### Check CUDA Status
```bash
source ~/ai-tools/hf-env/bin/activate
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0)}')"
```

### Check Authentication
```bash
source ~/ai-tools/hf-env/bin/activate
huggingface-cli whoami
```

### Check Downloaded Models
```bash
ls -lh ~/.cache/huggingface/hub/
```

### Clear Cache (if needed)
```bash
rm -rf ~/.cache/huggingface/hub/
```

## File Structure

```
~/ai-tools/
├── hf-env/                    # Virtual environment
├── download_models.py         # Python download script
├── download_models_cli.sh     # Bash download script
├── test_flux.py               # FLUX test script
├── test_outputs/              # Generated images
└── README.md                  # This file
```

## Related Documentation

- Main roadmap: `/home/dev/Development/kidsGames/game_design/technical_specs/HUGGINGFACE_SETUP_LEARNING_ROADMAP.md`
- Game designs: `/home/dev/Development/kidsGames/game_design/`
- Expert agents: `/home/dev/Development/kidsGames/agent_system/agents/`

## Support

For issues or questions, refer to:
- Hugging Face docs: https://huggingface.co/docs
- FLUX documentation: https://huggingface.co/black-forest-labs/FLUX.1-schnell
- Project issue tracker: `ISSUE_flux_authentication.md`
