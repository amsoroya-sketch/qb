# Bug Fix Guide
## Fixing Validation Issues - Asset Regeneration Workflow

**Created**: October 14, 2025
**Tool**: `fix_validation_issues.py`

---

## Quick Fix Workflow

```bash
# 1. Validate to find issues
python validate_all_games.py

# 2. Check what needs fixing
python fix_validation_issues.py game02_complete

# 3. Auto-fix (regenerate failed assets)
python fix_validation_issues.py game02_complete --auto

# 4. Re-validate to confirm
python validate_assets.py outputs/game02_complete/
```

---

## What the Fix Script Does

`fix_validation_issues.py` automatically:

✅ **Identifies** invalid assets from validation reports
✅ **Suggests** fixes based on issue type
✅ **Finds** the original CSV specification
✅ **Creates** a fix CSV with only failed assets
✅ **Regenerates** failed assets
✅ **Guides** manual fixes if needed

---

## Usage

### Check Issues (No Changes)

```bash
python fix_validation_issues.py game02_complete
```

**Output**:
```
⚠️  Found 1 invalid asset(s)

SUGGESTED FIXES
❌ ui_progress_stars.png (image)
   Issue: Height too small: 112px (min 128px)
   Fix: Update CSV to specify exact dimensions

NEXT STEPS
Option 1 - Auto-fix (regenerate with same CSV)
Option 2 - Manual fix (edit CSV first)
Option 3 - Manual regeneration
```

### Auto-Fix (Regenerate Failed Assets)

```bash
python fix_validation_issues.py game02_complete --auto
```

**What happens**:
1. Finds validation issues
2. Creates temporary CSV with only failed assets
3. Regenerates those assets automatically
4. Tells you to re-validate

**Use when**: Issues are random/temporary (corruption, timing)

### Manual Fix (Edit CSV First)

```bash
python fix_validation_issues.py game02_complete --edit
```

**What happens**:
1. Shows exactly which assets failed
2. Shows the CSV file to edit
3. Gives step-by-step instructions
4. Waits for you to fix CSV manually

**Use when**: Issues need CSV changes (dimensions, prompts)

### Fix All Games

```bash
# Check all games
python fix_validation_issues.py --all

# Auto-fix all games
python fix_validation_issues.py --all --auto
```

---

## Common Issues & Fixes

### Issue: Width/Height Too Small

**Example**: `Height too small: 112px (min 128px)`

**Fix**: Edit CSV to specify exact dimensions

**Before**:
```csv
EMO-UI-002,image,ui_progress_stars.png,Five gold stars in row,600,120,flat,,
```

**After**:
```csv
EMO-UI-002,image,ui_progress_stars.png,Five gold stars in row exact dimensions 600 width 128 height,600,128,flat,,
```

**Then**:
```bash
python production_pipeline.py game02_emotion_recognition_spec.csv --output outputs/game02_complete
python validate_assets.py outputs/game02_complete/
```

### Issue: Audio Too Short/Long

**Example**: `Too short: 0.3s (min 0.5s)`

**Fix**: Adjust text length in CSV

**Before**:
```csv
VO-001,audio,vo_intro.wav,,,,,Hi!,v2/en_speaker_6
```

**After**:
```csv
VO-001,audio,vo_intro.wav,,,,,Hello there!,v2/en_speaker_6
```

### Issue: File Too Large

**Example**: `File too large: 6.2MB (max 5MB)`

**Fix**: Reduce dimensions in CSV

**Before**:
```csv
BG-001,image,background.png,Detailed scene,1920,1080,realistic,,
```

**After**:
```csv
BG-001,image,background.png,Detailed scene,1280,720,realistic,,
```

### Issue: Cannot Open/Corrupted

**Example**: `Cannot open image: truncated file`

**Fix**: Auto-regenerate (likely corruption)

```bash
python fix_validation_issues.py game02_complete --auto
```

### Issue: Poor Quality (Blurry, Wrong Content)

**Example**: Image doesn't match description

**Fix**: Improve CSV prompt

**Before**:
```csv
OBJ-001,image,car.png,a car,512,512,educational,,
```

**After**:
```csv
OBJ-001,image,car.png,Red toy car bright color simple design side view white background educational illustration,512,512,educational,,
```

---

## Workflows

### Workflow 1: Quick Auto-Fix

**When**: Random issues, no CSV changes needed

```bash
# Validate
python validate_all_games.py

# Auto-fix all issues
python fix_validation_issues.py --all --auto

# Re-validate
python validate_all_games.py
```

**Time**: ~5 minutes

### Workflow 2: Manual CSV Fix

**When**: Issues require better prompts or dimensions

```bash
# 1. Find issues
python fix_validation_issues.py game02_complete

# 2. Edit CSV (nano/vim/editor)
nano game02_emotion_recognition_spec.csv

# 3. Fix the specific asset rows

# 4. Regenerate
python production_pipeline.py game02_emotion_recognition_spec.csv --output outputs/game02_complete

# 5. Re-validate
python validate_assets.py outputs/game02_complete/
```

**Time**: ~10 minutes

### Workflow 3: Selective Regeneration

**When**: Only want to fix specific assets

```bash
# 1. Create minimal CSV with just failed assets
cat > fix_game02.csv << 'EOF'
asset_id,type,filename,description,width,height,style,text,voice
EMO-UI-002,image,ui_progress_stars.png,Five gold stars in row exact 600x128,600,128,flat,,
EOF

# 2. Regenerate just that asset
python production_pipeline.py fix_game02.csv --output outputs/game02_complete

# 3. Validate
python validate_assets.py outputs/game02_complete/
```

**Time**: ~2 minutes

---

## Script Options

```bash
# Check issues (no changes)
python fix_validation_issues.py <game_name>

# Auto-fix (regenerate)
python fix_validation_issues.py <game_name> --auto

# Manual fix workflow
python fix_validation_issues.py <game_name> --edit

# Fix all games
python fix_validation_issues.py --all

# Auto-fix all games
python fix_validation_issues.py --all --auto
```

---

## Understanding Validation Reports

### Validation Report Structure

```json
{
  "images": {
    "path/to/image.png": {
      "valid": false,
      "issues": ["Height too small: 112px (min 128px)"]
    }
  },
  "audio": {
    "path/to/audio.wav": {
      "valid": true,
      "issues": []
    }
  },
  "summary": {
    "images": {"total": 22, "valid": 21, "invalid": 1},
    "audio": {"total": 10, "valid": 10, "invalid": 0}
  }
}
```

### Issue Types

| Issue | Meaning | Fix |
|-------|---------|-----|
| `Width too small` | Image width < minimum (128px) | Update CSV dimensions |
| `Height too small` | Image height < minimum (128px) | Update CSV dimensions |
| `File too large` | Asset > 5MB | Reduce dimensions or quality |
| `Too short` | Audio < 0.5 seconds | Add more text |
| `Too long` | Audio > 30 seconds | Shorten text |
| `Cannot open` | File corrupted | Regenerate |

---

## Example: Fixing Game 02 UI Issue

### Current Issue

```
❌ ui_progress_stars.png
   Height too small: 112px (min 128px)
```

### Option 1: Auto-Fix

```bash
cd ~/ai-tools
source hf-env/bin/activate
python fix_validation_issues.py game02_complete --auto
```

**Result**: Regenerates with same CSV (might not fix dimension issue)

### Option 2: Manual Fix (Recommended)

```bash
# 1. Edit CSV
nano game02_emotion_recognition_spec.csv

# 2. Find line:
# EMO-UI-002,image,ui_progress_stars.png,Five gold stars in row for progress tracking,600,120,flat,,

# 3. Change height from 120 to 128:
# EMO-UI-002,image,ui_progress_stars.png,Five gold stars in row for progress tracking,600,128,flat,,

# 4. Also update description to be more explicit:
# EMO-UI-002,image,ui_progress_stars.png,Five gold stars in horizontal row 600x128 pixels for progress tracking,600,128,flat,,

# 5. Regenerate
python production_pipeline.py game02_emotion_recognition_spec.csv --output outputs/game02_complete

# 6. Validate
python validate_assets.py outputs/game02_complete/
```

**Expected Result**: ✅ All assets passed validation!

---

## Troubleshooting

### Script Says "No validation report found"

**Problem**: Haven't run validation yet

**Solution**:
```bash
python validate_assets.py outputs/game02_complete/
# Then run fix script
```

### Script Can't Find CSV

**Problem**: CSV filename doesn't match game directory

**Solution**: Specify CSV manually
```bash
python production_pipeline.py path/to/correct.csv --output outputs/game02_complete
```

### Auto-Fix Doesn't Fix Issue

**Problem**: Issue requires CSV changes (dimensions, prompts)

**Solution**: Use manual fix workflow
```bash
python fix_validation_issues.py game02_complete --edit
# Follow instructions to edit CSV
```

### Regeneration Fails

**Problem**: GPU issue, corrupted CSV, or environment not activated

**Solution**:
```bash
# Check environment
source ~/ai-tools/hf-env/bin/activate

# Check GPU
nvidia-smi

# Check CSV format
cat game.csv | head -5

# Try again
python fix_validation_issues.py game02_complete --auto
```

---

## Best Practices

### 1. Validate Often

```bash
# After every generation run
python validate_all_games.py
```

### 2. Fix Issues Immediately

Don't let validation issues accumulate - fix them right away:
```bash
python fix_validation_issues.py game02_complete --auto
```

### 3. Improve CSV Prompts

Learn from issues and improve future CSVs:
- Be specific about dimensions
- Add "exact dimensions" to descriptions
- Use detailed prompts for better quality

### 4. Track Regenerations

Keep a log of what you regenerated:
```bash
echo "$(date): Regenerated game02 ui_progress_stars.png" >> regeneration_log.txt
```

### 5. Validate After Fixes

Always re-validate after fixing:
```bash
python validate_assets.py outputs/game02_complete/
```

---

## Integration with Main Workflow

### Standard Workflow with Bug Fixes

```bash
# 1. Generate all games
python generate_all_games.py

# 2. Validate all games
python validate_all_games.py

# 3. Fix any issues
python fix_validation_issues.py --all --auto

# 4. Re-validate
python validate_all_games.py

# 5. If still issues, manual fix
python fix_validation_issues.py game02_complete --edit

# 6. Final validation
python validate_all_games.py

# 7. Hand off to dev team
```

---

## Quick Reference

```bash
# ==================================================
# VALIDATION
# ==================================================

# Validate single game
python validate_assets.py outputs/game02_complete/

# Validate all games
python validate_all_games.py

# ==================================================
# BUG FIXES
# ==================================================

# Check issues (no changes)
python fix_validation_issues.py game02_complete

# Auto-fix single game
python fix_validation_issues.py game02_complete --auto

# Manual fix workflow
python fix_validation_issues.py game02_complete --edit

# Fix all games
python fix_validation_issues.py --all --auto

# ==================================================
# REGENERATION
# ==================================================

# Regenerate single game
python production_pipeline.py game.csv --output outputs/game

# Regenerate specific asset (create mini CSV)
cat > fix.csv << EOF
asset_id,type,filename,description,width,height,style,text,voice
[paste row here]
EOF
python production_pipeline.py fix.csv --output outputs/game
```

---

## Summary

**fix_validation_issues.py** makes it easy to:
- ✅ Identify validation issues automatically
- ✅ Get fix suggestions for each issue type
- ✅ Auto-regenerate failed assets
- ✅ Guide manual CSV fixes
- ✅ Handle all games at once

**Typical fix time**: 2-10 minutes per game

**Use this script whenever validation shows issues!** 🔧
