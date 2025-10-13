# PM-001 Quick Start Guide
## Get Started in 5 Minutes - AI Asset Generation System

**Last Updated**: October 14, 2025
**Your Role**: Project Manager for AI Resource Generation (Step 8)
**System Status**: ✅ Production Ready

---

## 1. Your First Task (10 Minutes)

### Generate Assets for Game 01 (Remaining)

**Status**: Game 01 is 89% complete (16/18 images done), but missing audio

**What's Needed**:
- 2 UI images (remaining from original spec)
- 10 voice-over clips (not yet generated)

**How to Complete**:

```bash
# 1. Go to working directory
cd ~/ai-tools

# 2. Activate environment
source hf-env/bin/activate

# 3. Check what's missing
cat game01_complete_spec.csv

# 4. Generate remaining assets (pipeline auto-skips completed)
python production_pipeline.py game01_complete_spec.csv --output outputs/game01_complete

# 5. Validate results
python validate_assets.py outputs/game01_complete/

# Done! Check outputs/game01_complete/ for all assets
```

**Expected Time**: ~5 minutes (10 audio clips × 25s each)

---

## 2. The 3-Command Workflow

For ANY game, you only need 3 commands:

```bash
# Step 1: Activate
source ~/ai-tools/hf-env/bin/activate

# Step 2: Generate
python production_pipeline.py game_XX_spec.csv --output outputs/game_XX

# Step 3: Validate
python validate_assets.py outputs/game_XX/
```

That's it! The pipeline handles everything else:
- ✅ Loads models automatically
- ✅ Generates images and audio in sequence
- ✅ Retries on failure (3 attempts)
- ✅ Resumes if interrupted
- ✅ Saves complete manifest
- ✅ Logs all activity

---

## 3. Games Priority Order

Work on games in this order (easiest to hardest):

### ✅ COMPLETE
- **Game 01**: Color Matching (89% done - finish audio)
- **Game 02**: Emotion Recognition (100% done)

### 📋 NEXT (Week 1)
- **Game 04**: Requesting Skills (~40 assets)
  - Easier than Game 03 (fewer assets)
  - Good practice for intermediate complexity

### 📋 SOON (Week 2)
- **Game 03**: Counting Adventure (180+ assets)
  - Most complex game
  - Plan to generate in batches

### 📋 LATER (Weeks 3-4)
- **Game 05-10**: Follow same pattern

---

## 4. How to Create a CSV

### Option A: Extract from GDD (Recommended)

All Game Design Documents are here:
```bash
~/Development/kidsGames/game_design/month_1_games/GAME_XX_*.md
~/Development/kidsGames/game_design/month_2_games/GAME_XX_*.md
~/Development/kidsGames/game_design/month_3_games/GAME_XX_*.md
```

**Process**:
1. Open the GDD in your editor
2. Find "Section 7: Content Specifications" or "Visual Assets Required"
3. Extract all assets listed
4. Create CSV rows following the template below

### Option B: Use Existing Templates

Study these examples:
```bash
cat game01_complete_spec.csv     # Simple (23 assets)
cat game02_emotion_recognition_spec.csv  # Medium (34 assets)
```

### CSV Format (Required Columns)

```csv
asset_id,type,filename,description,width,height,style,text,voice
OBJ-001,image,apple_red.png,Red apple bright shiny with green leaf,512,512,educational,,
VO-001,audio,vo_intro.wav,,,,,Welcome to the game!,v2/en_speaker_6
```

**Column Definitions**:
- `asset_id`: Unique ID (e.g., OBJ-001, BG-001, VO-001)
- `type`: "image" or "audio"
- `filename`: Output filename
- `description`: For images - detailed prompt (10-20 words)
- `width`: Image width (256, 512, 1024, 1920)
- `height`: Image height (256, 512, 1024, 1080)
- `style`: "educational", "realistic", or "flat"
- `text`: For audio - text to speak
- `voice`: Voice preset (v2/en_speaker_3, v2/en_speaker_6, v2/en_speaker_9)

**Tips for Great Prompts**:
- ❌ Bad: "a car"
- ✅ Good: "Red toy car simple design side view bright color clean white background"

**Voice Selection**:
- `v2/en_speaker_3`: Calm, clear (adult male)
- `v2/en_speaker_6`: Warm, friendly (adult female) - DEFAULT
- `v2/en_speaker_9`: Excited, energetic (child-like)

---

## 5. Monitoring Progress

### Check GPU Status
```bash
nvidia-smi
```
Should show:
- GPU-Util: 95-100%
- Memory: 6000-7000 MB used

### Watch Generation Live
```bash
tail -f outputs/game_XX/generation.log
```

### Check Manifest
```bash
cat outputs/game_XX/asset_manifest.json | python3 -m json.tool
```

### Count Generated Assets
```bash
# Images
find outputs/game_XX -name "*.png" | wc -l

# Audio
find outputs/game_XX -name "*.wav" | wc -l
```

---

## 6. Common Issues & Fixes

### Issue: "CUDA out of memory"
**Fix**:
```bash
# Close other applications using GPU
# Restart pipeline (auto-resumes)
python production_pipeline.py game.csv --output outputs/game
```

### Issue: "Authentication error"
**Fix**:
```bash
huggingface-cli login
# Paste token when prompted
```

### Issue: Pipeline crashed/interrupted
**Fix**:
```bash
# Just re-run the same command
# Pipeline automatically skips completed assets!
python production_pipeline.py game.csv --output outputs/game
```

### Issue: Poor image quality
**Fix**: Improve CSV prompts - be more specific:
- Add exact colors: "bright red", "light blue"
- Add style keywords: "educational illustration", "cartoon style"
- Add background: "white background", "transparent background"

### Issue: Robotic voice
**Fix**: Try different voice preset in CSV:
- Change from `v2/en_speaker_3` to `v2/en_speaker_6` (warmer)
- Or try `v2/en_speaker_9` (more energetic)

---

## 7. Performance Expectations

Based on Game 02 production test:

| Asset Type | Time per Asset | Hourly Capacity |
|------------|----------------|-----------------|
| Image (512×512) | ~30s | ~120 images |
| Image (1024×1024) | ~38s | ~94 images |
| Image (1920×1080) | ~60s | ~60 images |
| Audio (5-10 words) | ~10s | ~360 clips |
| Audio (15-20 words) | ~25s | ~144 clips |

**Timeline Estimates**:
- Small game (20-40 assets): **10-20 minutes**
- Medium game (40-80 assets): **20-40 minutes**
- Large game (100+ assets): **1-2 hours**

**All 10 games**: 2-3 days total (with overnight runs)

---

## 8. Quality Standards

### Validation Criteria

All assets must pass these checks:
- ✅ Images: Width/height meet specs (min 128px)
- ✅ Images: File size < 5MB
- ✅ Images: Not corrupted
- ✅ Audio: Duration 0.5-30 seconds
- ✅ Audio: Sample rate 24kHz

### Manual QA (10% Sample)

**You should manually review**:
- 10% of images (open and inspect)
- 10% of audio (listen for clarity)

**Check for**:
- Colors accurate to description
- Objects clear and recognizable
- Voice pacing appropriate for children
- No clipping or distortion

### Success Criteria Per Game

Before handing off to development team:
- [ ] 100% of CSV assets generated
- [ ] 95%+ validation pass rate
- [ ] Manual QA sample approved
- [ ] Manifest and logs complete

---

## 9. Agent Coordination

### Your Direct Reports (You Assign Tasks To)

**FLUX-001** (Image Generation):
- **Command**: Assign CSV with `type="image"` rows
- **Turnaround**: ~30-40s per image
- **Escalate to**: Quality issues with images

**VOICE-001** (Voice Synthesis):
- **Command**: Assign CSV with `type="audio"` rows
- **Turnaround**: ~10-25s per clip
- **Escalate to**: Voice quality issues

### Who You Report To

**GAME-001** (Unity Developer):
- **You receive from**: Game Design Documents
- **You deliver to**: Completed assets + manifest

**GODOT-001** (Godot Developer):
- **You receive from**: Godot-specific requirements
- **You deliver to**: Completed assets + manifest

### Who You Hand Off To

**QA-001** (Quality Assurance):
- **You deliver**: Validated assets + validation report
- **They test**: Integration, performance, quality

**DEVOPS-001** (DevOps):
- **You deliver**: Approved assets for deployment
- **They deploy**: To staging/production

---

## 10. Your Weekly Workflow

### Monday: Planning
- Review which games need assets
- Check GDDs from GAME-001/GODOT-001
- Create CSVs for the week
- Prioritize based on dev team needs

### Tuesday-Thursday: Generation
- Run production pipeline for each game
- Monitor progress
- Validate results
- Regenerate any failures

### Friday: Handoff
- Final quality checks
- Package assets for dev team
- Create handoff report
- Update PM tracking

---

## 11. Essential Files Reference

### Documentation (Read First!)
```bash
~/ai-tools/TEAM_USAGE_GUIDE.md           # Complete system guide
~/ai-tools/PM001_HANDOFF_DOCUMENT.md     # Your responsibilities
~/ai-tools/DAY_5_COMPLETION_REPORT.md    # System validation results
```

### Example CSVs (Study These!)
```bash
~/ai-tools/game01_complete_spec.csv      # 23 assets (simple)
~/ai-tools/game02_emotion_recognition_spec.csv  # 34 assets (medium)
```

### Game Design Documents
```bash
~/Development/kidsGames/game_design/month_1_games/
~/Development/kidsGames/game_design/month_2_games/
~/Development/kidsGames/game_design/month_3_games/
```

### Scripts (You'll Use Daily)
```bash
~/ai-tools/production_pipeline.py       # Main generator
~/ai-tools/validate_assets.py           # Quality validator
```

---

## 12. Quick Commands Cheat Sheet

```bash
# ==================================================
# DAILY COMMANDS
# ==================================================

# Activate environment
source ~/ai-tools/hf-env/bin/activate

# Generate assets
python production_pipeline.py game.csv --output outputs/game

# Validate
python validate_assets.py outputs/game/

# Count assets
find outputs/game -name "*.png" | wc -l
find outputs/game -name "*.wav" | wc -l

# ==================================================
# MONITORING
# ==================================================

# GPU status
nvidia-smi

# Watch generation
tail -f outputs/game/generation.log

# View manifest
cat outputs/game/asset_manifest.json | python3 -m json.tool

# ==================================================
# TROUBLESHOOTING
# ==================================================

# Check auth
huggingface-cli whoami

# Check CUDA
python -c "import torch; print(torch.cuda.is_available())"

# Check Python packages
pip list | grep -E "torch|diffusers|transformers"

# ==================================================
# CSV MANIPULATION
# ==================================================

# Filter only images
awk -F, '$2=="image"' game.csv > images_only.csv

# Filter only audio
awk -F, '$2=="audio"' game.csv > audio_only.csv

# Count rows
wc -l game.csv

# View CSV nicely
column -t -s, game.csv | less
```

---

## 13. Success Metrics (Track Monthly)

**You should track and report**:

### Generation Metrics
- Total assets generated this month
- Average time per asset type
- Success rate (% generated on first attempt)
- Regeneration frequency

### Quality Metrics
- Validation pass rate (target: >95%)
- Critical defects found (target: 0)
- Manual QA findings

### Timeline Metrics
- Days per game (target: <1 day)
- Games completed this month
- On-time delivery rate

### Cost Savings
- Assets that would have cost $X via cloud APIs
- Actual cost: $0
- ROI calculation

---

## 14. Getting Help

### Check Logs First
```bash
tail -100 outputs/game/generation.log
```

### Check Manifest
```bash
cat outputs/game/asset_manifest.json | jq '.summary'
```

### System Status
```bash
nvidia-smi
python -c "import torch; print(f'CUDA: {torch.cuda.is_available()}')"
huggingface-cli whoami
```

### Escalation Path

**Technical issues** → DEVOPS-001
**Quality issues** → FLUX-001 or VOICE-001
**Clinical concerns** → BCBA-001, SLP-001
**Timeline concerns** → ARCH-001

---

## 15. Next Steps for YOU

### Today (First 30 Minutes)
1. ✅ Read this Quick Start Guide
2. 📋 Complete Game 01 audio (10 clips)
3. 📋 Validate Game 01 is 100% complete
4. 📋 Create CSV for Game 04 (easier than Game 03)

### This Week
1. 📋 Generate all Game 04 assets
2. 📋 Start CSV for Game 03 (plan in batches)
3. 📋 Hand off completed games to dev team

### This Month
1. 📋 Complete all 10 games
2. 📋 Establish weekly reporting
3. 📋 Document lessons learned

---

## Welcome to Your System! 🚀

**PM-001**, you now control a production AI asset generation system that:
- ✅ Generates 94 images/hour (1024×1024)
- ✅ Generates 360 audio clips/hour
- ✅ Saves $24,000/year vs cloud APIs
- ✅ Produces assets in 2-3 days (all 10 games)
- ✅ Works 100% locally (HIPAA/COPPA compliant)

**Your mission**: Generate assets for Games 03-10 over the next 2-3 weeks.

**You've got the tools. You've got the docs. You've got this!** 💪

---

*Start with completing Game 01 audio - it's your warmup! ⚡*
