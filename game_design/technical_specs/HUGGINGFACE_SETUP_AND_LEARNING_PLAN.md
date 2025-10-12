# Hugging Face Setup & Learning Plan
## SkillBridge Educational Gaming Platform
**Complete Training Program for AI Resource Generation Team**

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Target Audience**: AI Resource Team, Game Developers, Project Managers
**Timeline**: 2 weeks (setup + training)

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Week 1: Setup & Foundations](#week-1-setup-foundations)
3. [Week 2: Production Workflows](#week-2-production-workflows)
4. [Team Training Matrix](#team-training-matrix)
5. [Best Practices & Optimization](#best-practices-optimization)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Evaluation & Certification](#evaluation-certification)

---

## 1. EXECUTIVE SUMMARY

### Learning Objectives

By the end of this 2-week program, your team will be able to:

✅ **Setup**: Install and configure all required Hugging Face models locally
✅ **Generation**: Create game assets (images, audio, 3D) using AI models
✅ **Optimization**: Fine-tune prompts for autism-friendly, brand-consistent output
✅ **Automation**: Build batch processing pipelines for 100+ assets
✅ **Quality Control**: Validate AI outputs meet clinical and accessibility standards
✅ **Cost Management**: Track savings vs cloud APIs, optimize performance

### Success Metrics

**Technical**:
- ✅ All team members can run FLUX, Bark, Stable Audio locally
- ✅ Generate 50+ high-quality assets per person per day
- ✅ <5% regeneration rate (quality issues)

**Clinical**:
- ✅ 100% assets pass WCAG 2.1 AA validation
- ✅ Diverse representation in generated faces (25% per major ethnicity)
- ✅ Zero ableist content in AI-generated scenarios

**Business**:
- ✅ Reduce asset production time by 80% (2 hours vs 10 hours manual)
- ✅ Save $24,000/year vs cloud APIs
- ✅ Enable 75 games/year production capacity (vs 30 manual)

---

## 2. WEEK 1: SETUP & FOUNDATIONS

### Day 1: Environment Setup (8 hours)

#### Morning Session (4 hours): System Preparation

**Prerequisites Check**:
```bash
# 1. Verify hardware
nvidia-smi  # Should show RTX 4070, 8GB VRAM
free -h     # Should show 32GB RAM
df -h       # Should have 100GB+ free space

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install essential tools
sudo apt install -y git curl wget build-essential python3-pip python3-venv
```

**Create Hugging Face Account** (15 minutes):
1. Go to https://huggingface.co/join
2. Sign up with work email: [your-name]@skillbridge.com
3. Verify email
4. Complete profile:
   - Organization: SkillBridge Educational Gaming
   - Use Case: Educational game development
   - Industry: EdTech

**Generate Access Token** (5 minutes):
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: `skillbridge-dev-token`
4. Type: **Write** (allows downloads + uploads)
5. Copy token to password manager (you'll only see it once!)

**Accept Model Licenses** (30 minutes):

Visit each model page and click "Agree and access repository":

**Critical Models** (must accept):
1. https://huggingface.co/black-forest-labs/FLUX.1-schnell
2. https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct

**Optional Models** (accept as needed):
3. https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
4. https://huggingface.co/openai/whisper-large-v3

**Install Hugging Face CLI** (10 minutes):
```bash
# 1. Create Python virtual environment
cd /home/dev/ai-tools
python3 -m venv hf-env
source hf-env/bin/activate

# 2. Install Hugging Face CLI
pip install --upgrade huggingface_hub[cli]

# 3. Login with your token
huggingface-cli login
# When prompted, paste your token from step above
# Choose: "Add token as git credential? (Y/n)" → Y

# 4. Verify login
huggingface-cli whoami
# Should show your username and organization
```

**Test Authentication** (5 minutes):
```bash
# Try downloading a gated model
huggingface-cli download black-forest-labs/FLUX.1-schnell \
  --local-dir ./test-download \
  --local-dir-use-symlinks False

# If successful, you'll see download progress
# If it fails with 401 error, re-check token and license acceptance
```

#### Afternoon Session (4 hours): Install Core Models

**1. FLUX.1-schnell Installation** (60 minutes):

Run existing setup script:
```bash
cd /home/dev/Development/kidsGames
bash scripts/setup_flux_ai.sh
```

**What this installs**:
- Python dependencies: `diffusers`, `transformers`, `accelerate`, `torch`
- FLUX.1-schnell model (12GB download)
- Test script to verify installation

**Manual verification**:
```python
# Test FLUX installation
python3 << EOF
import torch
from diffusers import FluxPipeline

print("Loading FLUX.1-schnell...")
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
)
pipe.to("cuda")

print("Generating test image...")
prompt = "simple red apple on white background, educational illustration"
image = pipe(
    prompt,
    num_inference_steps=4,
    guidance_scale=0.0,
    height=512,
    width=512
).images[0]

image.save("test_flux_output.png")
print("✅ Success! Check test_flux_output.png")
EOF
```

**2. Bark Installation** (30 minutes):
```bash
# Install Bark for voice synthesis
pip install git+https://github.com/suno-ai/bark.git
pip install scipy

# Download models (8-12GB, automatic on first run)
python3 << EOF
from bark import SAMPLE_RATE, generate_audio, preload_models
print("Downloading Bark models (this may take 10-15 minutes)...")
preload_models()
print("✅ Bark models downloaded!")
EOF
```

**Test Bark**:
```python
python3 << EOF
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

preload_models()

text = "Touch the happy face! Great job!"
print(f"Generating audio: {text}")
audio = generate_audio(text, history_prompt="v2/en_speaker_6")

write_wav("test_bark_output.wav", SAMPLE_RATE, audio)
print("✅ Success! Check test_bark_output.wav")
EOF
```

**3. Stable Audio Open Installation** (45 minutes):
```bash
# Run existing setup script
bash scripts/setup_stable_audio.sh
```

**Test Stable Audio**:
```python
python3 << EOF
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond
from scipy.io.wavfile import write as write_wav

print("Loading Stable Audio Open...")
model, config = get_pretrained_model("stabilityai/stable-audio-open-1.0")

prompt = "cheerful xylophone chime, 2 seconds, 44.1kHz"
print(f"Generating audio: {prompt}")

audio = generate_diffusion_cond(
    model,
    steps=100,
    cfg_scale=7,
    conditioner={"prompt": prompt, "seconds_start": 0, "seconds_total": 2}
)

write_wav("test_stable_audio.wav", 44100, audio[0])
print("✅ Success! Check test_stable_audio.wav")
EOF
```

**End of Day 1 Deliverable**:
- ✅ Hugging Face account created and authenticated
- ✅ FLUX.1-schnell installed and tested
- ✅ Bark installed and tested
- ✅ Stable Audio Open installed and tested
- ✅ 3 test outputs generated (1 image, 2 audio files)

---

### Day 2: Image Generation Mastery (8 hours)

#### Morning Session (4 hours): FLUX Prompt Engineering

**Learning Objective**: Master prompt engineering for autism-friendly visuals

**Exercise 1: Basic Prompting** (60 minutes)

```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

# EXERCISE: Generate 5 facial expressions
emotions = ["happy", "sad", "angry", "surprised", "calm"]

for emotion in emotions:
    # Basic prompt (BEFORE optimization)
    basic_prompt = f"{emotion} face"

    # Optimized prompt (AFTER learning)
    optimized_prompt = (
        f"Portrait photo of {emotion} child, age 5-7, "
        f"clear facial expression, educational illustration style, "
        f"neutral background, high contrast, simple composition, "
        f"diverse ethnicity, front-facing, well-lit"
    )

    # Generate both versions
    basic_img = pipe(basic_prompt, num_inference_steps=4).images[0]
    optimized_img = pipe(optimized_prompt, num_inference_steps=4).images[0]

    # Save for comparison
    basic_img.save(f"exercise1_basic_{emotion}.png")
    optimized_img.save(f"exercise1_optimized_{emotion}.png")

print("✅ Compare basic vs optimized prompts")
print("Note: Optimized prompts are clearer, more consistent, autism-friendly")
```

**What You Learn**:
- Specific details → better results ("child" not "person")
- Style keywords → consistency ("educational illustration style")
- Negative space → reduce visual clutter ("neutral background")
- Accessibility → high contrast for sensory needs

**Exercise 2: Diversity & Representation** (60 minutes)

```python
# CRITICAL: Generate diverse faces for Game 02 (Emotion Recognition)

ethnicities = [
    "African American",
    "East Asian",
    "Latino",
    "Middle Eastern",
    "Caucasian",
    "South Asian"
]

for ethnicity in ethnicities:
    prompt = (
        f"Portrait photo of happy child, {ethnicity}, age 5-7, "
        f"big smile, clear facial expression, educational game asset, "
        f"neutral gray background, soft lighting, front-facing camera, "
        f"photorealistic but friendly, high resolution"
    )

    # Generate 3 variations for each ethnicity
    for i in range(3):
        image = pipe(prompt, num_inference_steps=4).images[0]
        image.save(f"diverse_happy_{ethnicity.replace(' ', '_')}_{i+1}.png")

print("✅ Generated 18 diverse happy faces")
print("Review: Each ethnicity should have equal representation")
```

**Exercise 3: Autism-Specific Accommodations** (90 minutes)

```python
# Generate same face in 3 sensory profiles

base_prompt = "Portrait of happy child, age 6, educational illustration"

# Profile 1: Standard (neurotypical default)
standard_prompt = base_prompt + ", bright colors, detailed, vibrant"

# Profile 2: Calm Mode (reduced visual complexity)
calm_prompt = base_prompt + ", soft pastel colors, minimal details, simple, calming, muted tones, gentle"

# Profile 3: High Contrast (visual processing differences)
contrast_prompt = base_prompt + ", high contrast, bold colors, clear edges, simple shapes, graphic style"

# Generate all 3
standard_img = pipe(standard_prompt, num_inference_steps=4).images[0]
calm_img = pipe(calm_prompt, num_inference_steps=4).images[0]
contrast_img = pipe(contrast_prompt, num_inference_steps=4).images[0]

# Save
standard_img.save("sensory_standard.png")
calm_img.save("sensory_calm.png")
contrast_img.save("sensory_high_contrast.png")

print("✅ Compare sensory profiles")
print("Calm mode: Should be less visually overwhelming")
print("High contrast: Should have clear, bold edges")
```

**Homework**: Generate 10 emotion faces in each sensory profile (30 total)

#### Afternoon Session (4 hours): Batch Processing & Automation

**Exercise 4: CSV-Driven Batch Generation** (120 minutes)

Create asset specification CSV:
```csv
# assets_day2.csv
asset_id,type,description,emotion,ethnicity,age,sensory_profile
EMO-001,face,Happy child smiling,happy,African American,5,standard
EMO-002,face,Sad child with frown,sad,East Asian,6,standard
EMO-003,face,Angry child furrowed brows,angry,Latino,7,calm
EMO-004,face,Surprised child wide eyes,surprised,Middle Eastern,5,contrast
EMO-005,face,Calm child neutral expression,calm,Caucasian,6,standard
```

**Automation Script**:
```python
import pandas as pd
from diffusers import FluxPipeline
import torch
from pathlib import Path

# Load pipeline once (saves time)
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

# Read CSV
df = pd.read_csv("assets_day2.csv")

# Output directory
output_dir = Path("outputs/day2_batch")
output_dir.mkdir(parents=True, exist_ok=True)

# Process each asset
for idx, row in df.iterrows():
    # Build prompt from CSV data
    prompt = (
        f"Portrait photo of {row['emotion']} child, {row['ethnicity']}, "
        f"age {row['age']}, educational game asset, "
        f"neutral background, clear facial expression"
    )

    # Add sensory profile modifiers
    if row['sensory_profile'] == 'calm':
        prompt += ", soft pastel colors, minimal details, calming"
    elif row['sensory_profile'] == 'contrast':
        prompt += ", high contrast, bold colors, clear edges"

    # Generate
    print(f"Generating {row['asset_id']}: {row['description']}")
    image = pipe(prompt, num_inference_steps=4).images[0]

    # Save with asset ID as filename
    output_path = output_dir / f"{row['asset_id']}.png"
    image.save(output_path)

    print(f"  ✅ Saved to {output_path}")

print(f"\n✅ Generated {len(df)} assets in ~{len(df) * 4 / 60:.1f} minutes")
print(f"Output: {output_dir}")
```

**Exercise 5: Quality Validation** (60 minutes)

```python
from PIL import Image
import numpy as np

def validate_asset(image_path):
    """
    Validate AI-generated asset meets quality standards
    """
    img = Image.open(image_path)

    checks = {
        "resolution": False,
        "file_size": False,
        "not_corrupted": False,
        "has_content": False
    }

    # Check 1: Correct resolution (512x512)
    if img.size == (512, 512):
        checks["resolution"] = True

    # Check 2: File size >10KB (not blank)
    if image_path.stat().st_size > 10 * 1024:
        checks["file_size"] = True

    # Check 3: Not corrupted (can load as array)
    try:
        arr = np.array(img)
        checks["not_corrupted"] = True
    except:
        pass

    # Check 4: Has actual content (not all white/black)
    arr = np.array(img.convert('L'))  # Grayscale
    if 50 < arr.mean() < 200:  # Not pure black/white
        checks["has_content"] = True

    return checks

# Validate all generated assets
from pathlib import Path

output_dir = Path("outputs/day2_batch")
failed_assets = []

for img_path in output_dir.glob("*.png"):
    checks = validate_asset(img_path)

    if not all(checks.values()):
        print(f"❌ {img_path.name}: Failed checks: {[k for k,v in checks.items() if not v]}")
        failed_assets.append(img_path.name)
    else:
        print(f"✅ {img_path.name}: All checks passed")

if failed_assets:
    print(f"\n⚠️ {len(failed_assets)} assets need regeneration")
else:
    print(f"\n✅ All {len(list(output_dir.glob('*.png')))} assets validated!")
```

**End of Day 2 Deliverable**:
- ✅ Understand prompt engineering principles
- ✅ Generate diverse, autism-friendly faces
- ✅ Build batch processing scripts
- ✅ Validate asset quality automatically

---

### Day 3: Audio Generation Mastery (8 hours)

#### Morning Session (4 hours): Voice Synthesis with Bark

**Exercise 6: Voice Selection & Emotion** (90 minutes)

```python
from bark import SAMPLE_RATE, generate_audio, preload_models
from scipy.io.wavfile import write as write_wav

preload_models()

# Bark voice presets (9 English speakers)
voices = {
    "friendly_child": "v2/en_speaker_6",  # High pitch, cheerful
    "calm_narrator": "v2/en_speaker_3",   # Low pitch, soothing
    "enthusiastic": "v2/en_speaker_9",    # Energetic
    "gentle_female": "v2/en_speaker_1",   # Warm, maternal
    "neutral_male": "v2/en_speaker_5"     # Clear, educational
}

# Test script for Game 02 (Emotion Recognition)
script = "Touch the happy face! Great job!"

# Generate with each voice
for voice_name, voice_id in voices.items():
    print(f"Generating with {voice_name}...")
    audio = generate_audio(script, history_prompt=voice_id)
    write_wav(f"voice_test_{voice_name}.wav", SAMPLE_RATE, audio)

print("✅ Listen to all 5 voices and choose best for children ages 3-7")
print("Recommendation: 'friendly_child' or 'gentle_female'")
```

**Exercise 7: Emotional Prosody Control** (90 minutes)

```python
# Bark supports special markers for emotion/prosody

emotional_scripts = {
    "encouraging": {
        "text": "♪ You can do it! ♪ Keep trying!",
        "note": "♪ adds singing/melodic quality"
    },
    "celebrating": {
        "text": "[laughs] Awesome! You got it! [claps]",
        "note": "[] adds non-speech sounds"
    },
    "calming": {
        "text": "... Take your time ... It's okay ...",
        "note": "... adds pauses for pacing"
    },
    "excited": {
        "text": "WOW! AMAZING! YOU'RE DOING GREAT!",
        "note": "CAPS = louder, more emphasis"
    },
    "gentle": {
        "text": "that's nice. good job.",
        "note": "lowercase = quieter, softer"
    }
}

for emotion, data in emotional_scripts.items():
    print(f"\nGenerating {emotion} voice...")
    print(f"Text: {data['text']}")
    print(f"Tip: {data['note']}")

    audio = generate_audio(data['text'], history_prompt="v2/en_speaker_6")
    write_wav(f"emotion_prosody_{emotion}.wav", SAMPLE_RATE, audio)

print("\n✅ Listen to each and note how text formatting affects emotion")
```

#### Afternoon Session (4 hours): Music & Sound Effects

**Exercise 8: Stable Audio - Game Music** (120 minutes)

```python
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond
from scipy.io.wavfile import write as write_wav

model, config = get_pretrained_model("stabilityai/stable-audio-open-1.0")

# Generate background music for different game moods

music_prompts = {
    "calm_exploration": {
        "prompt": "soft ambient music, 60 BPM, gentle piano and strings, "
                  "no percussion, major key, calming, meditation, looping",
        "duration": 120,  # 2 minutes
        "use": "Game 02 (Emotion Recognition) - default mode"
    },

    "energetic_gameplay": {
        "prompt": "upbeat electronic music, 90 BPM, cheerful synths, "
                  "light percussion, major key, playful, video game style",
        "duration": 90,
        "use": "Game 03 (Counting Adventure) - active gameplay"
    },

    "celebration": {
        "prompt": "triumphant fanfare, 110 BPM, brass and percussion, "
                  "major key, victorious, celebration, short",
        "duration": 5,
        "use": "Level completion for all games"
    }
}

for music_name, specs in music_prompts.items():
    print(f"\nGenerating {music_name}...")
    print(f"  Use: {specs['use']}")
    print(f"  Duration: {specs['duration']}s")

    audio = generate_diffusion_cond(
        model,
        steps=200,  # Higher steps = better quality (but slower)
        cfg_scale=7,
        conditioner={
            "prompt": specs['prompt'],
            "seconds_start": 0,
            "seconds_total": specs['duration']
        }
    )

    filename = f"music_{music_name}.wav"
    write_wav(filename, 44100, audio[0])
    print(f"  ✅ Saved: {filename}")

print("\n✅ Review all 3 music tracks for appropriateness")
```

**Exercise 9: Sound Effects Generation** (60 minutes)

```python
# Generate sound effects for game feedback

sfx_prompts = {
    "success_chime": "cheerful xylophone chime, bright, happy, 1 second, ascending notes",
    "error_gentle": "soft descending tone, gentle, non-punitive, 0.5 seconds",
    "star_collect": "sparkle sound, magical twinkle, 0.3 seconds",
    "level_complete": "triumphant bell chime, celebration, 2 seconds",
    "button_click": "soft click sound, UI feedback, 0.1 seconds",
    "transition": "gentle whoosh, smooth transition, 0.5 seconds"
}

for sfx_name, prompt in sfx_prompts.items():
    print(f"Generating {sfx_name}...")

    # Extract duration from prompt
    duration = 1 if "1 second" in prompt else 0.5

    audio = generate_diffusion_cond(
        model,
        steps=100,
        cfg_scale=7,
        conditioner={
            "prompt": prompt,
            "seconds_start": 0,
            "seconds_total": duration
        }
    )

    write_wav(f"sfx_{sfx_name}.wav", 44100, audio[0])

print("✅ All SFX generated - test in game prototypes")
```

**End of Day 3 Deliverable**:
- ✅ 5 voice variations tested (select 2 primary voices)
- ✅ 5 emotional prosody samples
- ✅ 3 background music tracks (calm, energetic, celebration)
- ✅ 6 sound effects for game feedback

---

### Day 4: Advanced Techniques (8 hours)

#### Morning Session (4 hours): Fine-Tuning & Customization

**Exercise 10: Brand Style Consistency with LoRA** (180 minutes)

*Note: This is advanced - optional for Week 1*

```python
# Train a LoRA (Low-Rank Adaptation) on your art style
# Requires: 20-30 sample images of desired style

from diffusers import StableDiffusionXLPipeline, AutoencoderKL
from diffusers.loaders import LoraLoaderMixin
import torch

# This is a simplified example - full tutorial at:
# https://huggingface.co/docs/diffusers/training/lora

# 1. Prepare training data
"""
Create folder structure:
/training_data/
  /skillbridge_style/
    image1.png (example: your existing character design)
    image2.png
    ...
    image20.png

Each image should be 512x512 or 1024x1024
All should represent your desired art style
"""

# 2. Run training script (provided by Hugging Face)
# This takes 2-4 hours on RTX 4070

# 3. Once trained, use your custom LoRA:
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16
).to("cuda")

# Load YOUR custom LoRA
pipe.load_lora_weights("./lora_models/skillbridge_style_v1")

# Now all generations match your brand style
prompt = "happy child for educational game"
image = pipe(prompt).images[0]
# Result: In YOUR art style, not generic

image.save("branded_character.png")
```

**When to Use LoRA**:
- ✅ Month 2-3 (once you have established art style)
- ✅ If you need 100% brand consistency
- ✅ If you have 20+ example images of desired style

**When NOT to Use**:
- ❌ Week 1 (premature optimization)
- ❌ If style is still evolving
- ❌ If simple prompt engineering works

#### Afternoon Session (4 hours): Integration & APIs

**Exercise 11: Backend API Integration** (120 minutes)

```python
# Create Flask API for team to request asset generation

from flask import Flask, request, jsonify, send_file
from diffusers import FluxPipeline
import torch
from pathlib import Path
import uuid

app = Flask(__name__)

# Load model once at startup
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

OUTPUT_DIR = Path("./api_outputs")
OUTPUT_DIR.mkdir(exist_ok=True)

@app.route('/generate/image', methods=['POST'])
def generate_image():
    """
    POST /generate/image
    Body: {
        "prompt": "happy child face, educational illustration",
        "asset_id": "EMO-001",
        "width": 512,
        "height": 512
    }
    """
    data = request.json

    # Validate input
    if 'prompt' not in data:
        return jsonify({"error": "prompt is required"}), 400

    # Generate unique ID if not provided
    asset_id = data.get('asset_id', str(uuid.uuid4()))

    # Generate image
    image = pipe(
        data['prompt'],
        num_inference_steps=4,
        height=data.get('height', 512),
        width=data.get('width', 512)
    ).images[0]

    # Save
    output_path = OUTPUT_DIR / f"{asset_id}.png"
    image.save(output_path)

    return jsonify({
        "status": "success",
        "asset_id": asset_id,
        "url": f"/outputs/{asset_id}.png"
    })

@app.route('/outputs/<filename>')
def serve_output(filename):
    return send_file(OUTPUT_DIR / filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Test API**:
```bash
# Start server
python api_server.py

# In another terminal, test:
curl -X POST http://localhost:5000/generate/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "happy child face, age 5, educational game",
    "asset_id": "TEST-001"
  }'

# Response:
# {"status": "success", "asset_id": "TEST-001", "url": "/outputs/TEST-001.png"}

# Download:
curl http://localhost:5000/outputs/TEST-001.png -o test_api_output.png
```

**Exercise 12: Batch Job Queue** (60 minutes)

```python
# For processing 100+ assets overnight

import pandas as pd
from queue import Queue
from threading import Thread
import time

# Job queue
job_queue = Queue()
results = []

def worker():
    """Worker thread to process jobs"""
    while True:
        job = job_queue.get()
        if job is None:
            break

        # Process job
        asset_id = job['asset_id']
        prompt = job['prompt']

        print(f"Processing {asset_id}...")

        try:
            image = pipe(prompt, num_inference_steps=4).images[0]
            output_path = Path(f"outputs/batch/{asset_id}.png")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            image.save(output_path)

            results.append({"asset_id": asset_id, "status": "success"})
            print(f"  ✅ {asset_id} complete")

        except Exception as e:
            results.append({"asset_id": asset_id, "status": "failed", "error": str(e)})
            print(f"  ❌ {asset_id} failed: {e}")

        job_queue.task_done()

# Load jobs from CSV
df = pd.read_csv("large_batch_job.csv")  # 100+ rows
for _, row in df.iterrows():
    job_queue.put({
        "asset_id": row['asset_id'],
        "prompt": row['prompt']
    })

# Start 2 worker threads (RTX 4070 can handle 2 concurrent generations)
num_workers = 2
workers = []
for i in range(num_workers):
    t = Thread(target=worker)
    t.start()
    workers.append(t)

print(f"Started {num_workers} workers processing {len(df)} jobs...")

# Wait for all jobs to complete
job_queue.join()

# Stop workers
for i in range(num_workers):
    job_queue.put(None)
for t in workers:
    t.join()

# Save results
results_df = pd.DataFrame(results)
results_df.to_csv("batch_results.csv", index=False)

success_count = len([r for r in results if r['status'] == 'success'])
print(f"\n✅ Batch complete: {success_count}/{len(df)} succeeded")
```

**End of Day 4 Deliverable**:
- ✅ Understand LoRA fine-tuning (optional advanced technique)
- ✅ Build Flask API for team asset requests
- ✅ Create batch processing queue for overnight jobs

---

### Day 5: Production Readiness (8 hours)

#### Full Day: Real-World Asset Generation

**Final Project: Generate Assets for Game 01 (Color Matching)**

**Requirements** (from GAME_01_COLOR_MATCHING_PUZZLE.md):
- 120 colored objects (30 objects × 4 colors)
- 12 containers (3 types × 4 colors)
- 4 environment backgrounds
- Total: 136 image assets

**Step 1: Create Asset Specification CSV** (30 minutes)

```csv
# game01_assets.csv
asset_id,category,object,color,size,description
OBJ-001,fruit,apple,red,medium,Red apple fruit for color matching
OBJ-002,fruit,apple,blue,medium,Blue apple fruit for color matching
OBJ-003,fruit,apple,green,medium,Green apple fruit for color matching
OBJ-004,fruit,apple,yellow,medium,Yellow apple fruit for color matching
OBJ-005,fruit,banana,yellow,medium,Yellow banana fruit
OBJ-006,fruit,banana,red,medium,Red banana fruit
... (120 rows for objects)

CNT-001,container,basket,red,large,Red woven basket container
CNT-002,container,basket,blue,large,Blue woven basket container
... (12 rows for containers)

BG-001,background,park,green,full,Park scene with grass and trees
BG-002,background,classroom,neutral,full,Classroom with desks
BG-003,background,living_room,warm,full,Home living room
BG-004,background,backyard,bright,full,Outdoor backyard scene
```

**Step 2: Generate All Assets** (3 hours)

```python
import pandas as pd
from diffusers import FluxPipeline
import torch
from pathlib import Path
from tqdm import tqdm  # Progress bar

# Load pipeline
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

# Read CSV
df = pd.read_csv("game01_assets.csv")

# Output directories
output_dirs = {
    "fruit": Path("outputs/game01/objects/fruit"),
    "toy": Path("outputs/game01/objects/toys"),
    "vehicle": Path("outputs/game01/objects/vehicles"),
    "container": Path("outputs/game01/containers"),
    "background": Path("outputs/game01/backgrounds")
}

for dir_path in output_dirs.values():
    dir_path.mkdir(parents=True, exist_ok=True)

# Process each asset
successful = 0
failed = []

for idx, row in tqdm(df.iterrows(), total=len(df), desc="Generating assets"):
    try:
        # Build prompt based on category
        if row['category'] in ['fruit', 'toy', 'vehicle']:
            prompt = (
                f"{row['color']} {row['object']}, simple 3D render style, "
                f"clean white background, centered, educational game asset, "
                f"child-friendly, no text, high quality"
            )
            output_dir = output_dirs[row['category']]

        elif row['category'] == 'container':
            prompt = (
                f"{row['color']} {row['object']}, simple container, "
                f"white background, centered, top-down view, "
                f"educational game asset, clean style"
            )
            output_dir = output_dirs['container']

        elif row['category'] == 'background':
            prompt = (
                f"{row['description']}, cartoon illustration style, "
                f"bright colors, child-friendly, educational game background, "
                f"no characters, wide shot"
            )
            output_dir = output_dirs['background']

        # Generate
        image = pipe(prompt, num_inference_steps=4, height=512, width=512).images[0]

        # Save
        output_path = output_dir / f"{row['asset_id']}.png"
        image.save(output_path)

        successful += 1

    except Exception as e:
        print(f"❌ Failed {row['asset_id']}: {e}")
        failed.append(row['asset_id'])

print(f"\n✅ Generation complete!")
print(f"  Success: {successful}/{len(df)}")
print(f"  Failed: {len(failed)}")
if failed:
    print(f"  Failed IDs: {failed}")

print(f"\nTime estimate: {len(df) * 4 / 60:.1f} minutes")
print(f"Cost vs DALL-E 3: ${len(df) * 0.04:.2f} saved")
```

**Step 3: Quality Validation** (2 hours)

```python
# Manual review checklist
validation_criteria = {
    "correct_color": "Object is the specified color",
    "clear_object": "Object is recognizable",
    "clean_background": "Background is white/neutral",
    "centered": "Object is centered in frame",
    "no_text": "No unwanted text/watermarks",
    "appropriate": "Child-friendly, safe for ages 2-5"
}

# Automated checks
def auto_validate(image_path):
    from PIL import Image
    import numpy as np

    img = Image.open(image_path)
    arr = np.array(img)

    checks = {}

    # Check 1: Correct size
    checks['size'] = img.size == (512, 512)

    # Check 2: Not blank (has color variation)
    checks['has_content'] = arr.std() > 10

    # Check 3: Background is light (white/neutral)
    # Sample edges to check background
    edges = np.concatenate([
        arr[0, :],    # Top edge
        arr[-1, :],   # Bottom edge
        arr[:, 0],    # Left edge
        arr[:, -1]    # Right edge
    ])
    checks['light_background'] = edges.mean() > 200

    return checks

# Run validation
from pathlib import Path

all_assets = list(Path("outputs/game01").rglob("*.png"))
failed_validation = []

for asset_path in all_assets:
    checks = auto_validate(asset_path)
    if not all(checks.values()):
        failed_validation.append({
            "asset": asset_path.name,
            "failed_checks": [k for k, v in checks.items() if not v]
        })

if failed_validation:
    print(f"⚠️ {len(failed_validation)} assets need manual review:")
    for item in failed_validation:
        print(f"  {item['asset']}: {item['failed_checks']}")
else:
    print(f"✅ All {len(all_assets)} assets passed automated validation!")
```

**Step 4: Clinical Review Preparation** (2 hours)

Create review package for BCBA, SLP, OT, Autistic Advocate:

```python
# Generate HTML preview for clinical review
html_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Game 01 Asset Review</title>
    <style>
        body { font-family: Arial; margin: 20px; }
        .asset { display: inline-block; margin: 10px; text-align: center; }
        .asset img { border: 1px solid #ccc; }
        .category { margin-top: 30px; }
        h2 { border-bottom: 2px solid #333; }
    </style>
</head>
<body>
    <h1>Game 01: Color Matching - Asset Review</h1>
    <p>Please review all assets for:</p>
    <ul>
        <li>Clinical appropriateness (BCBA/SLP/OT)</li>
        <li>Color accuracy and clarity</li>
        <li>Child-friendly design (ages 2-5)</li>
        <li>Autism accommodations (no visual overload)</li>
        <li>Cultural sensitivity and diversity</li>
    </ul>

    {content}
</body>
</html>
"""

from pathlib import Path

content = ""

# Group by category
categories = ["objects/fruit", "objects/toys", "objects/vehicles", "containers", "backgrounds"]

for category in categories:
    content += f"<div class='category'><h2>{category.title()}</h2>"

    asset_dir = Path(f"outputs/game01/{category}")
    if asset_dir.exists():
        for img_path in sorted(asset_dir.glob("*.png")):
            content += f"""
            <div class='asset'>
                <img src='{img_path}' width='200'><br>
                <small>{img_path.stem}</small>
            </div>
            """

    content += "</div>"

html = html_template.format(content=content)

with open("game01_clinical_review.html", "w") as f:
    f.write(html)

print("✅ Clinical review page generated: game01_clinical_review.html")
print("  Share with BCBA-001, SLP-001, OT-001, ADVOCATE-001 for approval")
```

**End of Week 1 Deliverable**:
- ✅ All team members can generate high-quality assets
- ✅ Complete asset set for Game 01 (136 images)
- ✅ Clinical review package prepared
- ✅ $5.44 saved vs DALL-E 3 (136 images × $0.04)
- ✅ Time: 3 hours vs 2-3 weeks manual illustration

---

## 3. WEEK 2: PRODUCTION WORKFLOWS

### Day 6-10: Apply to Remaining Games

**Daily Schedule**:
- **Day 6**: Generate Game 02 assets (100 emotion faces + icons)
- **Day 7**: Generate Game 03 assets (180 countable objects)
- **Day 8**: Generate Game 04-05 assets (store items, characters)
- **Day 9**: Generate Game 06-07 assets (patterns, scenarios)
- **Day 10**: Generate Game 08-10 assets (3D models, environments)

**Each Day Follows Same Workflow**:
1. Review GDD asset requirements (1 hour)
2. Create CSV specification (1 hour)
3. Generate batch (2-4 hours)
4. Quality validation (1-2 hours)
5. Clinical review prep (1 hour)
6. Team feedback & iteration (1 hour)

**By End of Week 2**:
- ✅ All 10 games have complete asset sets
- ✅ Team is proficient in all AI tools
- ✅ Production pipeline is established
- ✅ $24,000 annual savings realized

---

## 4. TEAM TRAINING MATRIX

### Who Needs What Training?

| Role | FLUX | Bark | Stable Audio | Whisper | Llama 3.1 | Priority |
|------|------|------|--------------|---------|-----------|----------|
| **AI Resource Coordinator** | ✅ Expert | ✅ Expert | ✅ Expert | ✅ Advanced | ✅ Advanced | 🔴 CRITICAL |
| **AI Prompt Engineers (2-3)** | ✅ Expert | ✅ Expert | ✅ Expert | ❌ Not needed | ✅ Advanced | 🔴 CRITICAL |
| **Game Developer** | ✅ Basic | ✅ Basic | ✅ Basic | ✅ Advanced | ❌ Not needed | 🟡 HIGH |
| **Frontend Developer** | ✅ Basic | ❌ Not needed | ❌ Not needed | ❌ Not needed | ❌ Not needed | 🟢 MEDIUM |
| **Backend Developer** | ❌ Not needed | ❌ Not needed | ❌ Not needed | ✅ Expert | ✅ Expert | 🟡 HIGH |
| **Project Manager** | ✅ Basic | ✅ Basic | ✅ Basic | ❌ Not needed | ✅ Basic | 🟡 HIGH |
| **BCBA/SLP/OT** | ✅ Awareness | ✅ Awareness | ❌ Not needed | ❌ Not needed | ✅ Awareness | 🟢 MEDIUM |

**Training Levels**:
- **Expert** (40 hours): Can troubleshoot, optimize, train others
- **Advanced** (20 hours): Can build production pipelines
- **Basic** (10 hours): Can generate assets with templates
- **Awareness** (2 hours): Understands capabilities, can review outputs

---

## 5. BEST PRACTICES & OPTIMIZATION

### Prompt Engineering Principles

**DO**:
✅ Be specific: "child age 5-7" not "young person"
✅ Include style: "educational illustration style"
✅ Specify background: "white background, centered"
✅ Mention constraints: "no text, no watermarks"
✅ Add accessibility: "high contrast, clear edges" for visual needs
✅ Diversify: Always include ethnicity, gender diversity

**DON'T**:
❌ Use vague terms: "nice face" → too ambiguous
❌ Forget negative prompts: Can lead to cluttered backgrounds
❌ Assume defaults: FLUX defaults to photorealistic unless specified
❌ Use copyrighted characters: "Mickey Mouse" → legal issues
❌ Generate only one ethnicity: Creates bias in dataset

### Performance Optimization

**RTX 4070 (8GB VRAM) Limits**:
- ✅ FLUX: 512×512 images (4GB VRAM)
- ✅ Bark: Short clips <30sec (3GB VRAM)
- ✅ Stable Audio: 2-minute clips (2GB VRAM)
- ⚠️ SDXL 1024×1024: Needs 7GB (tight squeeze)

**Optimization Tips**:
```python
# 1. Use bfloat16 instead of float32 (saves 50% VRAM)
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16  # Not float16!
)

# 2. Enable CPU offloading for tight VRAM
pipe.enable_model_cpu_offload()

# 3. Clear cache between generations
import torch
torch.cuda.empty_cache()

# 4. Generate in batches of 4-8 (not 100 at once)
for batch in batched_prompts:
    images = pipe(batch)
    torch.cuda.empty_cache()  # Clear after each batch
```

---

## 6. TROUBLESHOOTING GUIDE

### Common Issues

**Issue 1: "CUDA out of memory"**

```bash
Symptom: RuntimeError: CUDA out of memory
Solution:
1. Check VRAM usage: nvidia-smi
2. Reduce image size: 1024×1024 → 512×512
3. Enable CPU offload: pipe.enable_model_cpu_offload()
4. Close other GPU programs (browsers with hardware acceleration)
5. Clear cache: torch.cuda.empty_cache()
```

**Issue 2: "401 Unauthorized" when downloading model**

```bash
Symptom: huggingface_hub.errors.GatedRepoError: 401 Client Error
Solution:
1. Re-login: huggingface-cli login
2. Check token has 'write' permission
3. Accept model license on Hugging Face website
4. Wait 5 minutes (permission propagation delay)
```

**Issue 3: "Low quality / blurry images"**

```python
Symptom: Generated images are blurry or lack detail
Solution:
1. Increase inference steps (FLUX default is 4, try 8-12)
   image = pipe(prompt, num_inference_steps=12).images[0]

2. Add detail keywords to prompt:
   "high resolution, sharp details, professional quality"

3. Check if model loaded correctly:
   print(pipe.dtype)  # Should be torch.bfloat16, not float32
```

**Issue 4: "Bark voice is robotic"**

```python
Symptom: Generated speech sounds unnatural
Solution:
1. Try different voice presets (v2/en_speaker_1 through _9)
2. Add emotion markers: "♪ text ♪" for singing quality
3. Use punctuation: "Hello! How are you?" vs "Hello how are you"
4. Chunk long text (Bark best at <50 words per generation)
```

---

## 7. EVALUATION & CERTIFICATION

### Week 2 Final Exam (Day 10)

**Practical Test** (4 hours):

Generate complete asset set for a new mini-game (not in GDD):

**Assignment**: "Fruit Sorting Game"
- 12 fruit images (3 fruits × 4 colors)
- 4 sorting container images
- 1 background image
- 5 voice-over clips ("Touch the red apple", etc.)
- 3 sound effects (success, error, complete)

**Requirements**:
- ✅ All assets meet quality standards (512×512, clear, no artifacts)
- ✅ Diverse fruit types (apple, banana, orange, grape)
- ✅ Colors accurate (red, blue, green, yellow)
- ✅ Voice-overs clear and child-friendly
- ✅ Complete in <3 hours
- ✅ Cost: $0 (vs $0.96 with DALL-E 3)

**Passing Criteria**:
- 90%+ assets approved on first try
- <10% regeneration rate
- Completed within time limit
- Followed autism-friendly design guidelines

### Certification Levels

**Level 1: Asset Generator** (Week 1 graduate)
- Can generate assets from CSV specifications
- Understands basic prompt engineering
- Operates FLUX, Bark, Stable Audio

**Level 2: Prompt Engineer** (Week 2 graduate)
- Optimizes prompts for brand consistency
- Handles complex multi-attribute assets
- Troubleshoots quality issues independently

**Level 3: AI Resource Lead** (Month 2 goal)
- Builds custom LoRA adapters
- Designs production pipelines
- Trains other team members
- Evaluates new models for adoption

---

## APPENDICES

### A. Quick Reference Cards

**FLUX.1-schnell Cheat Sheet**:
```python
from diffusers import FluxPipeline
import torch

pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
).to("cuda")

# Standard generation
image = pipe(
    prompt="your prompt here",
    num_inference_steps=4,  # 4 for schnell, 28 for dev
    height=512,
    width=512
).images[0]

image.save("output.png")
```

**Bark Cheat Sheet**:
```python
from bark import generate_audio, SAMPLE_RATE, preload_models
from scipy.io.wavfile import write

preload_models()

audio = generate_audio(
    "Your text here",
    history_prompt="v2/en_speaker_6"  # Child-friendly voice
)

write("output.wav", SAMPLE_RATE, audio)
```

**Stable Audio Cheat Sheet**:
```python
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond
from scipy.io.wavfile import write

model, config = get_pretrained_model("stabilityai/stable-audio-open-1.0")

audio = generate_diffusion_cond(
    model,
    steps=100,
    cfg_scale=7,
    conditioner={
        "prompt": "your description, 44.1kHz",
        "seconds_start": 0,
        "seconds_total": 30  # Duration in seconds
    }
)

write("output.wav", 44100, audio[0])
```

### B. Resource Links

**Official Documentation**:
- Hugging Face Hub: https://huggingface.co/docs/hub/
- Diffusers Library: https://huggingface.co/docs/diffusers/
- Transformers Library: https://huggingface.co/docs/transformers/
- FLUX.1 Model Card: https://huggingface.co/black-forest-labs/FLUX.1-schnell
- Bark Documentation: https://github.com/suno-ai/bark
- Stable Audio: https://huggingface.co/stabilityai/stable-audio-open-1.0

**Community Resources**:
- Discord: https://discord.gg/hugging-face
- Forums: https://discuss.huggingface.co/
- Reddit: r/StableDiffusion, r/MachineLearning

**SkillBridge Internal**:
- Asset Specifications: `/game_design/[month]/GAME_XX_*.md` (Section 5)
- Clinical Guidelines: `/resources/design_standards/README.md`
- Hugging Face Resources Guide: `/game_design/technical_specs/HUGGINGFACE_RESOURCES_GUIDE.md`

---

## CONCLUSION

### Summary

This 2-week program transforms your team from AI beginners to production-ready asset generators. By Week 2 end, you'll have:

✅ **All 10 games** with complete AI-generated asset sets
✅ **$24,000/year** savings vs cloud APIs
✅ **80% time reduction** in asset production
✅ **Unlimited iterations** for perfect clinical alignment
✅ **Full privacy compliance** (HIPAA/COPPA)

### Next Steps

**Week 3**: Clinical validation of all generated assets
**Month 2**: Fine-tune LoRA for brand consistency
**Month 3**: Explore advanced models (Whisper for speech, Llama for content)
**Month 4**: Train team members to Level 3 (AI Resource Lead)

### Success Stories (Projected)

**Game 01** (Color Matching):
- Manual timeline: 2-3 weeks (illustrator + revisions)
- AI timeline: 3 hours (generate + validate)
- Cost: $0 vs $2,000-5,000 (freelance illustrator)

**Game 07** (Social Scenarios):
- Manual timeline: 4 weeks (scriptwriter + validation)
- AI timeline: 2 days (Llama 3.1 + clinical review)
- Cost: $0 vs $8,000-15,000 (professional writer)

**Total Impact**:
- 75 games/year (vs 30 manual)
- $24,000/year saved
- 6,000 hours/year saved (team productivity)

---

**Document Status**: ✅ Complete
**Next Review**: After Week 1 completion
**Owner**: AI Resource Team Lead (to be hired)
**Questions**: Contact [Your PM] or post in #ai-resources Slack channel

---

*Go build amazing, autism-affirming educational experiences! 🚀*
