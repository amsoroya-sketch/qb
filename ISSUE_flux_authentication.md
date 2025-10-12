# Setup FLUX.1 Hugging Face Authentication for AI Image Generation

## Issue: FLUX.1 Model Download Requires Authentication

### Problem
The FLUX.1-schnell model download failed with authentication error:
```
huggingface_hub.errors.GatedRepoError: 401 Client Error
Access to model black-forest-labs/FLUX.1-schnell is restricted.
You must have access to it and be authenticated to access it.
```

### Required Steps

#### 1. Create Hugging Face Account (if needed)
- Visit: https://huggingface.co/join
- Create free account

#### 2. Accept FLUX.1-schnell License Agreement
- Visit: https://huggingface.co/black-forest-labs/FLUX.1-schnell
- Click **"Agree and access repository"** button
- License: Apache 2.0 (100% commercial-safe ✅)

#### 3. Create Access Token
- Visit: https://huggingface.co/settings/tokens
- Click **"New token"**
- Name: `flux-download`
- Permission: **"Read"** access
- Copy the generated token (save it securely)

#### 4. Authenticate Hugging Face CLI
```bash
# Activate FLUX environment
source ~/ai-tools/flux-env/bin/activate

# Login with token
huggingface-cli login

# Paste your token when prompted
```

#### 5. Re-run FLUX Setup
```bash
bash ~/ai-tools/setup_flux_ai.sh
```

### Expected Downloads
After authentication succeeds:
- FLUX.1-schnell model (~23GB)
- SDXL Lightning (~7GB)
- ControlNet models (~5GB)
- Total: ~35GB

### Verification
After successful installation:
```bash
# Check downloaded models
ls -lh ~/ai-tools/downloads/flux1-schnell/

# Start ComfyUI to test
bash ~/ai-tools/start_comfyui_flux.sh
```

### Documentation Reference
- Agent Spec: `agent_system/agents/12_flux_image_expert.md`
- Setup Guide: `scripts/README.md`
- AI Tools Overview: `game_design/technical_specs/LOCAL_AI_RESOURCE_GENERATION_SETUP.md`

### Related
- Part of 10 AI resource generation agents created
- Required for Step 8 (AI-Assisted Resource Generation) in game workflow
- Zero cost vs $5-10/game with cloud APIs

### Labels
- `setup`
- `ai-tools`
- `blocked-external`
- `documentation`

### Priority
**Medium** - Required before generating game assets, but one-time setup

---

**Created by**: Claude Code automated documentation
**Date**: 2025-10-12
