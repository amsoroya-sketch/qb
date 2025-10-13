#!/usr/bin/env python3
"""
Auto-download script - No prompts, just downloads
"""

import os
from datetime import datetime
from huggingface_hub import snapshot_download

models = [
    ("black-forest-labs/FLUX.1-schnell", "FLUX.1-schnell", "~12GB"),
    ("stabilityai/stable-audio-open-1.0", "Stable Audio", "~2GB"),
    ("suno/bark", "Bark TTS", "~10GB"),
    ("openai/whisper-large-v3", "Whisper v3", "~3GB"),
    ("openai/clip-vit-large-patch14", "CLIP", "~1.7GB"),
]

print("\n" + "="*70)
print("AUTO-DOWNLOADING AI MODELS")
print("="*70)
print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

for i, (model_id, name, size) in enumerate(models, 1):
    print(f"\n[{i}/{len(models)}] Downloading: {name} ({size})")
    print(f"Model ID: {model_id}")
    print("-" * 70)

    try:
        cache_dir = snapshot_download(
            repo_id=model_id,
            resume_download=True,
        )
        print(f"✓ SUCCESS: {name}")
        print(f"  Cached at: {cache_dir}\n")
    except Exception as e:
        print(f"✗ FAILED: {name}")
        print(f"  Error: {e}\n")
        continue

print("\n" + "="*70)
print("DOWNLOAD COMPLETE")
print("="*70)
print("\nSkipped: Llama 3.1 8B (requires license)")
print("To download Llama:")
print("1. Accept license: https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct")
print("2. Run: huggingface-cli download meta-llama/Llama-3.1-8B-Instruct")
print("\nCache location: ~/.cache/huggingface/hub/\n")
