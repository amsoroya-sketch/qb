# Batch Generation & Validation Guide
## Generate All Games at Once - Then Validate Later

**Created**: October 14, 2025
**For**: PM-001 and Development Team

---

## Quick Start (2 Commands)

```bash
# 1. Generate all games
python generate_all_games.py

# 2. Validate all games when done
python validate_all_games.py
```

That's it! Generate everything, then validate when complete.

---

## Why Separate Generation and Validation?

**Generation takes time** (~10-60 minutes per game):
- You can start generation and let it run
- Come back later to validate
- No need to babysit the process

**Validation is fast** (~5 seconds per game):
- Quick quality checks
- Consolidated report across all games
- Easy to review issues

---

## Workflow

### Step 1: Generate All Assets

```bash
cd ~/ai-tools
source hf-env/bin/activate
python generate_all_games.py
```

**What it does**:
- Finds all game CSVs
- Generates assets for each game
- Skips already-complete games
- Can resume if interrupted
- Runs unattended

**Expected time**:
- Game 01: ~5 min (audio only)
- Game 02: Already complete (skipped)
- Game 03: ~45 min (180+ assets)
- Game 04: ~15 min (~40 assets)
- Game 05-10: Varies by complexity

**Total**: 2-3 hours for all games (can run overnight)

### Step 2: Validate All Assets

```bash
python validate_all_games.py
```

**What it does**:
- Validates all generated assets
- Checks image dimensions, file sizes
- Checks audio duration, quality
- Generates consolidated report
- Shows issues clearly

**Output**:
```
✅ game01_complete:
   Images: 16/16 valid
   Audio:  10/10 valid

✅ game02_complete:
   Images: 21/22 valid
   Audio:  10/10 valid

TOTALS:
   Total Assets: 48
   Valid: 47/48 (97.9%)
   Invalid: 1
```

---

## Commands Reference

### Generate All Games

```bash
# Generate all incomplete games
python generate_all_games.py

# List available games and status
python generate_all_games.py --list

# Regenerate ALL games (even complete ones)
python generate_all_games.py --force
```

### Validate All Games

```bash
# Validate all games (summary)
python validate_all_games.py

# Show detailed issues for each asset
python validate_all_games.py --detailed
```

### Generate Single Game

```bash
# If you need to regenerate just one game
python production_pipeline.py game01_complete_spec.csv --output outputs/game01_complete
```

### Validate Single Game

```bash
# Validate specific game
python validate_assets.py outputs/game01_complete/
```

---

## Typical Workflow Examples

### Example 1: First Time Setup

```bash
# 1. Check what games are available
python generate_all_games.py --list

# Output:
# Game 01: Color Matching
#    CSV: ✅ game01_complete_spec.csv
#    Status: 📋 incomplete
#
# Game 02: Emotion Recognition
#    CSV: ✅ game02_emotion_recognition_spec.csv
#    Status: ✅ complete

# 2. Generate all incomplete games
python generate_all_games.py

# 3. Go get coffee ☕ (takes 5-60 min)

# 4. Come back and validate
python validate_all_games.py

# 5. Check results
cat outputs/validation_summary_all_games.json
```

### Example 2: Adding New Games

```bash
# 1. Create CSV for Game 04
# Edit: game04_requesting_skills_spec.csv

# 2. Run generation (will skip complete games)
python generate_all_games.py

# 3. Validate everything
python validate_all_games.py
```

### Example 3: Regenerating Failed Assets

```bash
# 1. Check detailed issues
python validate_all_games.py --detailed

# Output:
# game02_complete
# ❌ IMAGE: ui_progress_stars.png
#    • Height too small: 112px (min 128px)

# 2. Fix CSV prompt for that asset
# Edit: game02_emotion_recognition_spec.csv

# 3. Regenerate just that game
python production_pipeline.py game02_emotion_recognition_spec.csv --output outputs/game02_complete

# 4. Re-validate
python validate_all_games.py
```

### Example 4: Overnight Batch Run

```bash
# Before leaving for the day:
cd ~/ai-tools
source hf-env/bin/activate

# Run in background with logging
nohup python generate_all_games.py > generation_batch.log 2>&1 &

# Check progress
tail -f generation_batch.log

# Next morning:
# Check if complete
python validate_all_games.py

# Review consolidated report
cat outputs/validation_summary_all_games.json
```

---

## Understanding the Scripts

### generate_all_games.py

**What it does**:
1. Finds all game CSV files
2. Checks which games are incomplete
3. Runs `production_pipeline.py` for each game
4. Logs progress and results
5. Can resume if interrupted

**Key features**:
- Skips already-complete games (unless --force)
- Resume capability per game (from manifest)
- Shows estimated time
- Reports success/failure

### validate_all_games.py

**What it does**:
1. Finds all game output directories
2. Runs `validate_assets.py` for each
3. Collects all validation reports
4. Generates consolidated summary
5. Saves combined report

**Key features**:
- Fast validation (seconds)
- Consolidated metrics across all games
- Identifies games with issues
- Detailed issue viewer (--detailed)
- JSON report for automated processing

---

## Output Files

### Generation Outputs

For each game:
```
outputs/game01_complete/
├── images/
│   ├── objects/
│   ├── containers/
│   └── backgrounds/
├── audio/
│   └── voiceovers/
├── asset_manifest.json       ← Generation log
└── generation.log             ← Detailed logs
```

### Validation Outputs

For each game:
```
outputs/game01_complete/
└── validation_report.json     ← Quality check results
```

Consolidated:
```
outputs/
└── validation_summary_all_games.json  ← All games combined
```

---

## Monitoring Generation Progress

### Check if still running

```bash
ps aux | grep generate_all_games
```

### Watch GPU usage

```bash
nvidia-smi
# Should show 95-100% GPU utilization during generation
```

### Check specific game progress

```bash
tail -f outputs/game03_counting/generation.log
```

### Count generated assets so far

```bash
# Images
find outputs -name "*.png" | wc -l

# Audio
find outputs -name "*.wav" | wc -l
```

---

## Troubleshooting

### Script says "CSV not found"

**Problem**: Game CSV doesn't exist yet

**Solution**: Create CSV from GDD first
```bash
# Read the GDD
cat ~/Development/kidsGames/game_design/month_1_games/GAME_03_COUNTING_ADVENTURE.md

# Create CSV with asset specifications
# Use game01_complete_spec.csv as template
```

### Generation fails for one game

**Problem**: Error in CSV or GPU issue

**Solution**: Check logs
```bash
cat outputs/gameXX/generation.log
```

Common issues:
- Malformed CSV (missing columns)
- GPU out of memory (restart helps)
- Bad prompts (fix CSV descriptions)

### Validation shows issues

**Problem**: Some assets don't meet specs

**Solution**: Check detailed issues
```bash
python validate_all_games.py --detailed
```

Then:
1. Update CSV with better prompts
2. Regenerate that specific game
3. Re-validate

### Want to regenerate everything

```bash
# Force regeneration of ALL games
python generate_all_games.py --force

# Then validate
python validate_all_games.py
```

---

## Performance Expectations

### Generation Times (Per Game)

| Game Complexity | Assets | Time |
|----------------|--------|------|
| Small (Game 01) | 20-40 | 5-10 min |
| Medium (Game 02) | 40-80 | 10-20 min |
| Large (Game 03) | 100+ | 30-60 min |

### Validation Times

| Games | Time |
|-------|------|
| 1 game | ~5 seconds |
| All 10 games | ~30 seconds |

---

## Best Practices

### 1. Generate in Batches

Don't wait - start generation for available games:
```bash
# Generate what you have CSVs for
python generate_all_games.py

# While running, work on creating more CSVs
# Then run again later for new games
```

### 2. Validate After Batches Complete

Let generation run unattended, then validate:
```bash
# Morning: Start generation
python generate_all_games.py > batch.log 2>&1 &

# Afternoon: Check results
python validate_all_games.py
```

### 3. Use Consolidated Report

```bash
# Get overall metrics
cat outputs/validation_summary_all_games.json | python3 -m json.tool

# Check pass rate
cat outputs/validation_summary_all_games.json | grep -A 5 '"pass_rate"'
```

### 4. Track Progress

Keep a simple log:
```bash
# Check what's complete
python generate_all_games.py --list > games_status.txt

# After generation
python validate_all_games.py > validation_summary.txt
```

---

## Integration with PM-001 Workflow

### Weekly Workflow

**Monday**: Create CSVs for this week's games
```bash
# Create game04_requesting_skills_spec.csv
# Create game05_following_directions_spec.csv
```

**Tuesday Morning**: Start generation
```bash
python generate_all_games.py
```

**Tuesday Afternoon**: Validate
```bash
python validate_all_games.py
```

**Wednesday**: Hand off to dev team
```bash
# Package assets
tar -czf game04_assets.tar.gz outputs/game04_complete/
tar -czf game05_assets.tar.gz outputs/game05_complete/

# Send validation reports too
# outputs/validation_summary_all_games.json
```

---

## Success Criteria

### Per Game
- ✅ 100% assets generated
- ✅ >95% validation pass rate
- ✅ Complete manifest and logs
- ✅ Ready for dev team

### Overall System
- ✅ All 10 games generated within 2-3 weeks
- ✅ <5% regeneration rate
- ✅ Zero critical defects
- ✅ On-time delivery

---

## Quick Reference

```bash
# ==================================================
# GENERATION
# ==================================================

# List games
python generate_all_games.py --list

# Generate all
python generate_all_games.py

# Force regenerate all
python generate_all_games.py --force

# Single game
python production_pipeline.py game.csv --output outputs/game

# ==================================================
# VALIDATION
# ==================================================

# Validate all (summary)
python validate_all_games.py

# Validate all (detailed)
python validate_all_games.py --detailed

# Single game
python validate_assets.py outputs/game/

# View consolidated report
cat outputs/validation_summary_all_games.json | python3 -m json.tool

# ==================================================
# MONITORING
# ==================================================

# GPU status
nvidia-smi

# Check running processes
ps aux | grep generate_all

# Watch logs
tail -f outputs/game03/generation.log

# Count assets
find outputs -name "*.png" | wc -l
find outputs -name "*.wav" | wc -l
```

---

## Summary

**New Workflow**:
1. Create CSVs for games
2. Run: `python generate_all_games.py`
3. Let it run (unattended)
4. Run: `python validate_all_games.py`
5. Review consolidated report
6. Hand off to dev team

**Benefits**:
- ✅ Set it and forget it
- ✅ Generate multiple games at once
- ✅ Validate everything quickly
- ✅ Consolidated reporting
- ✅ Easy to track progress

**Perfect for PM-001's workflow!** 🚀
