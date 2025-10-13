# Hugging Face Asset Generation - Team Usage Guide
## SkillBridge Educational Gaming Platform

**Version**: 1.0
**Last Updated**: October 14, 2025
**System Status**: ✅ Production Ready

---

## Table of Contents

1. [Quick Start (5 minutes)](#quick-start)
2. [System Overview](#system-overview)
3. [Generating Assets](#generating-assets)
4. [Validating Quality](#validating-quality)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)
7. [Performance Tips](#performance-tips)

---

## Quick Start

### Generate Assets for Any Game (3 Commands)

```bash
# 1. Activate environment
source ~/ai-tools/hf-env/bin/activate

# 2. Generate all assets from CSV
python ~/ai-tools/production_pipeline.py game_XX_spec.csv --output outputs/game_XX

# 3. Validate quality
python ~/ai-tools/validate_assets.py outputs/game_XX/
```

**That's it!** Assets will be generated with retry logic, resume capability, and quality logging.

---

## System Overview

### What We Have

**Location**: `/home/dev/ai-tools/`

**Key Scripts**:
- `production_pipeline.py` - Main generation script (images + audio)
- `validate_assets.py` - Quality validation
- `generate_game01_assets.py` - Simple image-only generator
- `generate_game01_voice.py` - Simple audio-only generator

**Models Installed** (105GB total):
- FLUX.1-schnell (54GB) - Image generation
- Bark (21GB) - Voice synthesis
- Whisper v3 (24GB) - Speech recognition
- CLIP (6.4GB) - Image understanding

**GPU**: RTX 4070 Laptop (8GB VRAM)

### Directory Structure

```
~/ai-tools/
├── hf-env/                      # Virtual environment
├── production_pipeline.py       # Main production script
├── validate_assets.py           # Quality validator
├── game01_complete_spec.csv     # Example CSV
├── game02_emotion_recognition_spec.csv
└── outputs/                     # Generated assets
    ├── game01_complete/
    │   ├── images/
    │   │   ├── objects/
    │   │   ├── containers/
    │   │   ├── backgrounds/
    │   │   └── ui/
    │   ├── audio/
    │   │   └── voiceovers/
    │   ├── asset_manifest.json
    │   ├── generation.log
    │   └── validation_report.json
    └── game02/
        └── (same structure)
```

---

## Generating Assets

### Step 1: Create CSV Specification

Create a CSV file with your asset specifications:

**Required Columns**:
- `asset_id` - Unique identifier (e.g., "OBJ-001")
- `type` - Either "image" or "audio"
- `filename` - Output filename (e.g., "apple_red.png")
- `description` - For images: detailed prompt
- `width` - Image width (512, 1024, 1920)
- `height` - Image height (512, 1024, 1080)
- `style` - "educational", "realistic", or "flat"
- `text` - For audio: text to speak
- `voice` - Voice preset (v2/en_speaker_3, v2/en_speaker_6, v2/en_speaker_9)

**Example CSV**:
```csv
asset_id,type,filename,description,width,height,style,text,voice
OBJ-001,image,apple_red.png,Red apple bright shiny with green leaf,512,512,educational,,
VO-001,audio,vo_intro.wav,,,,,Welcome to the game!,v2/en_speaker_6
```

### Step 2: Run Production Pipeline

**Basic usage**:
```bash
cd ~/ai-tools
source hf-env/bin/activate
python production_pipeline.py your_game.csv --output outputs/your_game
```

**Advanced options**:
```bash
# Regenerate all assets (ignore completed)
python production_pipeline.py game.csv --output outputs/game --no-resume

# Custom log file
python production_pipeline.py game.csv --output outputs/game --log custom.log
```

### Step 3: Monitor Progress

The script will show:
```
======================================================================
GENERATING IMAGES
======================================================================
Images: 100%|██████████| 18/18 [09:25<00:00, 31.41s/it]

======================================================================
GENERATING AUDIO
======================================================================
Audio: 100%|██████████| 5/5 [02:15<00:00, 27.08s/it]

======================================================================
✅ GENERATION COMPLETE
======================================================================

Images:
  Success: 18/18
  Errors:  0
  Average: 31.4s per image

Audio:
  Success: 5/5
  Errors:  0
  Average: 27.1s per clip

Total time: 693.2s (11.6 min)
```

### Step 4: Check Output

**Files created**:
```
outputs/your_game/
├── images/              # All images organized by type
├── audio/              # All audio organized by type
├── asset_manifest.json # Complete generation log
├── generation.log      # Detailed logs
└── validation_report.json  # (after validation)
```

**Review manifest**:
```bash
cat outputs/your_game/asset_manifest.json | jq '.summary'
```

---

## Validating Quality

### Run Validation

```bash
python validate_assets.py outputs/your_game/
```

### Validation Output

```
============================================================
VALIDATION SUMMARY
============================================================

Images: 18/18 valid
Audio:  5/5 valid

✅ All assets passed validation!

📄 Full report: outputs/your_game/validation_report.json
```

### If Validation Fails

```
❌ apple_red.png
   - Width too small: 256px (min 512px)

❌ vo_intro.wav
   - Too short: 0.3s (min 0.5s)
```

**Fix issues** by:
1. Adjusting CSV specifications
2. Regenerating specific assets
3. Re-running validation

---

## Troubleshooting

### Issue: "CUDA out of memory"

**Symptoms**: Error during generation, GPU memory full

**Solutions**:
```bash
# 1. Close other GPU applications
nvidia-smi  # Check what's using GPU

# 2. Reduce batch size (generate fewer assets at once)
# Split your CSV into smaller files

# 3. Restart the pipeline (memory optimizations will help)
python production_pipeline.py game.csv --output outputs/game
```

### Issue: "Authentication error"

**Symptoms**: "401 Unauthorized" or "Access denied"

**Solution**:
```bash
# Re-authenticate with Hugging Face
huggingface-cli login
# Paste your token when prompted
```

### Issue: Generation is slow (<30 images/hour)

**Check GPU utilization**:
```bash
nvidia-smi

# Should show:
# - GPU-Util: 95-100%
# - Memory: 6000-7000 MB used
```

**If GPU utilization is low**:
```bash
# Verify CUDA is working
python -c "import torch; print(torch.cuda.is_available())"
# Should print: True

# If False, reinstall PyTorch
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

### Issue: Pipeline crashed/interrupted

**Resume automatically**:
```bash
# Just re-run the same command
python production_pipeline.py game.csv --output outputs/game
# It will skip completed assets!
```

### Issue: Poor image quality (blurry, wrong content)

**Improve prompt quality in CSV**:

❌ Bad: `description: a car`

✅ Good: `description: Red toy car simple design side view bright color clean`

**Tips**:
- Be specific about colors, shapes, style
- Add "educational illustration" for game assets
- Add "white background" for objects
- Add "autism-friendly" for character faces

### Issue: Voice sounds robotic

**Try different voice presets**:
- `v2/en_speaker_3` - Calm, clear (adult male)
- `v2/en_speaker_6` - Warm, friendly (adult female)
- `v2/en_speaker_9` - Excited, energetic (child-like)

---

## Best Practices

### CSV Organization

✅ **DO**:
- Use consistent asset ID prefixes (OBJ-001, CNT-001, BG-001, VO-001)
- Keep descriptions detailed but concise (10-20 words)
- Specify exact dimensions (512, 1024, 1920)
- Group similar assets together

❌ **DON'T**:
- Use vague descriptions ("a thing")
- Mix different image sizes without reason
- Leave required columns empty

### Asset Naming

✅ **Good filenames**:
- `apple_red.png` (clear, descriptive)
- `vo_instructions_level1.wav`
- `bg_playroom_calm.png`

❌ **Bad filenames**:
- `img1.png` (not descriptive)
- `file_final_FINAL_v3.png` (confusing)

### Performance Optimization

**Generate in priority order**:
1. High-priority assets first (gameplay critical)
2. Medium-priority assets (UI, backgrounds)
3. Low-priority assets (variations, alternates)

**Use resume capability**:
- Generate high-priority assets
- Review quality
- Adjust prompts if needed
- Continue with remaining assets

### Quality Control

**Validate frequently**:
```bash
# After every generation batch
python validate_assets.py outputs/game_XX/
```

**Manual review checklist**:
- [ ] Images match description in CSV
- [ ] Colors are accurate and vibrant
- [ ] Backgrounds are clean (for objects)
- [ ] Audio is clear (no clipping)
- [ ] Voice pace is appropriate for children

---

## Performance Tips

### Expected Generation Times

**Images** (RTX 4070, 8GB VRAM):
- 512×512px: ~28-30 seconds
- 1024×1024px: ~45-55 seconds
- 1920×1080px: ~60-70 seconds

**Audio** (24kHz, Bark):
- Short phrases (5-10 words): ~15-20 seconds
- Medium sentences (15-20 words): ~25-30 seconds
- Long text (30+ words): ~40-50 seconds

### Maximize Throughput

**Hourly capacity**:
- Images (512×512): ~120 per hour
- Images (1920×1080): ~60 per hour
- Audio clips: ~100 per hour

**Daily capacity** (8-hour workday):
- ~800 images (512×512)
- ~400 images (1920×1080)
- ~600 audio clips

**All 10 games**: 5-7 days total generation time

### Memory Management

**If running out of VRAM**:
1. Pipeline automatically uses CPU offloading
2. Reduces image size if needed (warned in logs)
3. Clears GPU memory between assets

**Monitor memory**:
```bash
watch -n 1 nvidia-smi  # Updates every second
```

---

## Common Tasks

### Generate Only Images from CSV

```python
# Filter CSV to only image rows
awk -F, '$2=="image"' game.csv > images_only.csv
python production_pipeline.py images_only.csv --output outputs/game
```

### Generate Only Audio from CSV

```python
awk -F, '$2=="audio"' game.csv > audio_only.csv
python production_pipeline.py audio_only.csv --output outputs/game
```

### Regenerate Failed Assets

```bash
# Check manifest for errors
cat outputs/game/asset_manifest.json | jq '.assets[] | select(.status=="error")'

# Extract failed asset IDs, fix in CSV, regenerate
python production_pipeline.py fixed_assets.csv --output outputs/game
```

### Test Single Asset Quickly

Create a test CSV with 1 asset:
```csv
asset_id,type,filename,description,width,height,style,text,voice
TEST-001,image,test.png,Red apple bright shiny,512,512,educational,,
```

```bash
python production_pipeline.py test.csv --output outputs/test
```

---

## Getting Help

### Check Logs

**Generation log** (detailed):
```bash
tail -100 outputs/game_XX/generation.log
```

**Manifest** (summary):
```bash
cat outputs/game_XX/asset_manifest.json | jq '.'
```

### System Status

```bash
# GPU status
nvidia-smi

# Python environment
source ~/ai-tools/hf-env/bin/activate
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"

# Authentication
huggingface-cli whoami
```

### Contact

- **Technical Issues**: Check generation.log and manifest
- **Quality Issues**: Review CSV descriptions and regenerate
- **System Issues**: Verify GPU, CUDA, authentication

---

## Quick Reference Commands

```bash
# Activate environment
source ~/ai-tools/hf-env/bin/activate

# Generate assets
python production_pipeline.py game.csv --output outputs/game

# Validate assets
python validate_assets.py outputs/game/

# Check GPU
nvidia-smi

# Check authentication
huggingface-cli whoami

# View logs
tail -50 outputs/game/generation.log

# Count assets
ls outputs/game/images/*/*.png | wc -l
ls outputs/game/audio/*/*.wav | wc -l
```

---

## Success! 🎉

You're now ready to generate production-quality assets for all SkillBridge games!

**System Capabilities**:
- ✅ 400,000+ AI models available via Hugging Face
- ✅ $0 cost (vs $24,000/year for cloud APIs)
- ✅ 100% local processing (HIPAA/COPPA compliant)
- ✅ Production-ready pipeline with retry + resume
- ✅ Automated quality validation

**Next Steps**:
1. Create CSV for your game (use Game 01/02 as templates)
2. Generate assets with production pipeline
3. Validate quality
4. Integrate with Unity

**Welcome to AI-powered game development!** 🚀
