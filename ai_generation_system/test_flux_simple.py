#!/usr/bin/env python3
"""
Simplified FLUX test - Works around version conflicts
"""

import torch
from diffusers import DiffusionPipeline
import os
from datetime import datetime

print("="*60)
print("FLUX.1-schnell Simple Test")
print("="*60)

# GPU check
print(f"\n✓ GPU: {torch.cuda.get_device_name(0)}")
print(f"✓ CUDA: {torch.cuda.is_available()}")

# Create output dir
output_dir = os.path.expanduser("~/ai-tools/test_outputs")
os.makedirs(output_dir, exist_ok=True)

print("\nLoading FLUX model (this may take a minute)...")

# Load with minimal options to avoid version conflicts
pipe = DiffusionPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-schnell",
    torch_dtype=torch.bfloat16
)
pipe.enable_model_cpu_offload()  # Saves VRAM

print("✓ Model loaded!\n")

# Simple test prompt
prompt = "A friendly cartoon apple with a smiling face, bright red color, simple design, white background"

print(f"Generating image...")
print(f"Prompt: {prompt}\n")

image = pipe(
    prompt,
    num_inference_steps=4,
    guidance_scale=0.0
).images[0]

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_path = os.path.join(output_dir, f"flux_test_{timestamp}.png")
image.save(output_path)

print(f"✓ SUCCESS!")
print(f"✓ Image saved: {output_path}")
print(f"✓ Size: {image.size}")
print("="*60)
